import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingDTO } from './dto/court-booking.dto';
import { UpdateCourtDto } from '../courts/dto/update-court.dto';
import { CourtBookingHistory } from '@prisma/client';
import * as moment from 'moment';

@Injectable()
export class CourtBookingsService {
    constructor(private readonly prisma: PrismaService) {}

    // NOTE - this is get all court bookings
    async getCourtBookings() {
        const findCourtBooking = await this.prisma.courtBooking.findMany({
            orderBy: {
                created_at: 'desc',
            },
            include: {
                courtSession: true,
            },
        });

        return findCourtBooking;
    }

    // NOTE - this is get court booking by id
    async getCourtBookingById(courtBookingId: string) {
        const courtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingId,
            },
            include: {
                courtSession: {
                    select: {
                        id: true,
                        court_booking_id: true,
                        created_at: true,
                        updated_at: true,
                        date: true,
                        duration_time: true,
                        available: true,
                    },
                },
            },
        });

        if (!courtBooking) {
            throw new BadRequestException('Court booking not found');
        }

        const currentTime = moment();

        // Update court availability based on duration time
        await Promise.all(
            courtBooking.courtSession.map(async (court) => {
                for (const duration of court.duration_time) {
                    const [end] = duration.split(' - ').map((time) => moment(time, 'h:mm A'));

                    if (currentTime.isAfter(end)) {
                        // Update the court availability in the database
                        await this.prisma.courtSession.update({
                            where: { id: court.id },
                            data: { available: false },
                        });
                        break;
                    }
                }
            }),
        );

        courtBooking.courtSession.map((court) => {
            court.duration_time.map((duration) => {
                const [start, end] = duration.split(' - ').map((time) => moment(time, 'h:mm A'));

                if (currentTime.isAfter(end)) {
                } else if (currentTime.isBetween(start, end)) {
                    return `ເວລາທີ່ທ່ານຈອງ (${duration}) ໄດ້ກາຍເວລາທີ່ກໍານົດແລ້ວ!!`;
                }
                return `ເວລາທີ່ທ່ານຈອງ (${duration}) ແມ່ນຍັງສາມາດໃຊ້ງານໄດ້.`;
            });
        });
    }

    async getCourtBookingById2(courtBookingId: string) {
        // console.log(new Date().toISOString());
        const courtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingId,
            },
            include: {
                courtSession: {
                    select: {
                        id: true,
                        court_booking_id: true,
                        created_at: true,
                        updated_at: true,
                        date: true,
                        duration_time: true,
                        available: true,
                    },
                },
                court_available: {
                    select: {
                        id: true,
                        totalAllCourtAvailable: true,
                        isExpiredAll: true,
                        all_total_amount: true,
                        date: true,
                        duration_time: true,
                    },
                },
            },
        });

        if (!courtBooking) {
            throw new BadRequestException('Court booking not found');
        }

        // this.usedCourtBookingIds.add(courtBookingId);

        const currentTime = moment();
        const availableDurations: string[] = [];
        const courtPrice = 80000;

        // Check and collect available duration times
        await Promise.all(
            courtBooking.courtSession.map(async (court) => {
                let courtHasAvailableDurations = false;

                const validDurations = court.duration_time.filter((duration) => {
                    const [end] = duration.split(' - ').map((time) => moment(time, 'h:mm A'));
                    return currentTime.isBefore(end);
                });

                if (validDurations.length > 0) {
                    courtHasAvailableDurations = true;
                    availableDurations.push(...validDurations);
                }

                // Update the court availability based on valid durations
                await this.prisma.courtSession.update({
                    where: { id: court.id },
                    data: { available: courtHasAvailableDurations },
                });
            }),
        );

        const totalAvailableCount = availableDurations.length;
        const totalAmount = totalAvailableCount * courtPrice;

        // Log for debugging
        console.log('available durations:', availableDurations);
        console.log('total available count:', totalAvailableCount);

        // Find existing CourtAvailable entry for the court booking
        const existingCourtAvailable = await this.prisma.courtAvailable.findFirst({
            where: { court_booking_id: courtBookingId },
        });

        // Log for debugging
        console.log('existing courtAvailable:', existingCourtAvailable);

        if (totalAvailableCount > 0) {
            if (existingCourtAvailable) {
                // Update existing entry
                await this.prisma.courtAvailable.update({
                    where: { id: existingCourtAvailable.id },
                    data: {
                        totalAllCourtAvailable: totalAvailableCount,
                        isExpiredAll: false,
                        all_total_amount: totalAmount,
                        date: courtBooking.courtSession.map((court) => court.date).join(', '),
                        duration_time: availableDurations,
                    },
                });
            } else {
                // Create new entry
                await this.prisma.courtAvailable.create({
                    data: {
                        court_booking_id: courtBookingId,
                        totalAllCourtAvailable: totalAvailableCount,
                        isExpiredAll: false,
                        all_total_amount: totalAmount,
                        date: courtBooking.courtSession.map((court) => court.date).join(', '),
                        duration_time: availableDurations,
                    },
                });
            }
        } else if (existingCourtAvailable) {
            await this.prisma.courtAvailable.update({
                where: { id: existingCourtAvailable.id },
                data: {
                    totalAllCourtAvailable: 0,
                    isExpiredAll: true,
                    all_total_amount: 0,
                    duration_time: [],
                },
            });
        }

        // Refresh the court booking data to include the newly created/updated court_available
        const updatedCourtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingId,
            },
            include: {
                courtSession: true,
                court_available: true,
            },
        });
        return updatedCourtBooking;
    }

    // NOTE - this is create court booking
    async createCourtBooking(courtBookingData: CourtBookingDTO) {
        // create court booking
        const createCourtBooking = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
                booked_by: courtBookingData.full_name,
                // total_amount: totalAmount,
                courtSession: {
                    create: courtBookingData.courtSession.map((court) => ({
                        ...court,
                    })),
                },
            },
            include: {
                courtSession: true,
            },
        });

        // create court booking history
        await this.prisma.courtBookingHistory.create({
            data: {
                court_booking_id: createCourtBooking.id,
                device_id: courtBookingData.device_id,
            },
        });

        return createCourtBooking;
    }

    async updateCourtBooking(courtBookingId: string, courtBookingData: UpdateCourtDto) {
        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('this court booking ID is not found');
        }

        const updateCourtBooking = await this.prisma.courtBooking.update({
            where: {
                id: courtBookingId,
            },
            data: {
                ...courtBookingData,
            },
        });

        return updateCourtBooking;
    }

    async deleteCourtBooking(courtBookingId: string) {
        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('this court booking ID is not found');
        }

        const deleteCourtBooking = await this.prisma.courtBooking.delete({
            where: {
                id: courtBookingId,
            },
        });

        return deleteCourtBooking;
    }

    //!SECTION - court booking history
    async createBookingHistory(courtBookingHistoryData: CourtBookingHistory) {
        return await this.prisma.courtBookingHistory.create({
            data: {
                ...courtBookingHistoryData,
            },
        });
    }

    async getAllCourtBookingHistory() {
        return await this.prisma.courtBookingHistory.findMany({
            include: {
                court_booking: true,
            },
        });
    }

    // NOTE - this is get all court bookings history
    async getCourtBookingHistoryByDeviceId(device_id: string) {
        return await this.prisma.courtBookingHistory.findMany({
            orderBy: {
                created_at: 'desc',
            },
            where: {
                device_id: device_id,
            },
            include: {
                court_booking: {
                    include: {
                        courtSession: {
                            select: {
                                date: true,
                                duration_time: true,
                                available: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
