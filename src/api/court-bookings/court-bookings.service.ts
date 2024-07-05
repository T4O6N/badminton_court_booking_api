import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingDTO } from './dto/court-booking.dto';
import { UpdateCourtDto } from '../courts/dto/update-court.dto';
import { CourtBookingHistory } from '@prisma/client';
import { parseDurationTime } from 'src/utils/timeUtil';
import { isAfter } from 'date-fns';

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
                court: true,
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
                court: {
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

        const currentTime = new Date();

        for (const courtEntry of courtBooking.court) {
            for (const durationTime of courtEntry.duration_time) {
                const { end } = parseDurationTime(durationTime);

                if (isAfter(currentTime, end)) {
                    courtEntry.available = false;
                    break;
                }
            }
        }

        const courtAvailableData = courtBooking.court.map((court) => ({
            date: court.date,
            duration_time: court.duration_time,
            total_amount: courtBooking.total_amount,
        }));

        // Return structured data
        return {
            id: courtBooking.id,
            device_id: courtBooking.device_id,
            phone: courtBooking.phone,
            full_name: courtBooking.full_name,
            court_number: courtBooking.court_number,
            payment_status: courtBooking.payment_status,
            total_amount: courtBooking.total_amount,
            booked_by: courtBooking.booked_by,
            created_at: courtBooking.created_at.toISOString(),
            updated_at: courtBooking.updated_at.toISOString(),
            court: courtBooking.court,
            court_available: courtAvailableData,
        };
    }

    // NOTE - this is create court booking
    async createCourtBooking(courtBookingData: CourtBookingDTO) {
        // calculate total amount
        // const totalAmount = this.calculateTotalAmount(courtBookingData);

        // create court booking
        const createCourtBooking = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
                booked_by: courtBookingData.full_name,
                // total_amount: totalAmount,
                court: {
                    create: courtBookingData.court.map((court) => ({
                        ...court,
                    })),
                },
            },
            include: {
                court: true,
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

    // calculateTotalAmount(courtBookingData: CourtBookingDTO): number {
    //     let totalAmount = 0;
    //     courtBookingData.court.forEach((court) => {
    //         totalAmount += court.court_price;
    //     });
    //     return totalAmount;
    // }

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
            where: {
                device_id: device_id,
            },
            include: {
                court_booking: {
                    include: {
                        court: {
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
