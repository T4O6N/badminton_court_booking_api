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
                court: true,
            },
        });

        return findCourtBooking;
    }

    // NOTE - this is get court booking by id
    async getCourtBookingById(courtBookingId: string) {
        const findCourtBooking = await this.prisma.courtBooking.findUnique({
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

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found');
        }

        // const durationTimeSlots = [
        //     '9:00 AM - 10:00 AM',
        //     '10:00 AM - 11:00 AM',
        //     '11:00 AM - 12:00 PM',
        //     '12:00 PM - 1:00 PM',
        //     '1:00 PM - 2:00 PM',
        //     '2:00 PM - 3:00 PM',
        //     '3:00 PM - 4:00 PM',
        //     '4:00 PM - 5:00 PM',
        //     '5:00 PM - 6:00 PM',
        //     '6:00 PM - 7:00 PM',
        //     '7:00 PM - 8:00 PM',
        //     '8:00 PM - 9:00 PM',
        //     '9:00 PM - 10:00 PM',
        //     '10:00 PM - 11:00 PM',
        // ];

        // const currentTime = moment();
        // // Update court availability based on duration time
        // await Promise.all(
        //     findCourtBooking.court.map(async (court) => {
        //         for (const duration of court.duration_time) {
        //             const [end] = duration.split(' - ').map((time) => moment(time, 'h:mm A'));

        //             if (currentTime.isAfter(end)) {
        //                 // Update the court availability in the database
        //                 await this.prisma.court.update({
        //                     where: { id: court.id },
        //                     data: { available: false },
        //                 });
        //                 break; // No need to check further once we set it to unavailable
        //             }
        //         }
        //     }),
        // );

        // Generate courtAvailableData with appropriate messages
        const courtAvailableData = findCourtBooking.court.map((court) => {
            // const messages = court.duration_time.map((duration) => {
            //     const [start, end] = duration.split(' - ').map((time) => moment(time, 'h:mm A'));

            //     if (currentTime.isAfter(end)) {
            //         return `The booking duration (${duration}) has already passed. Payment cannot be made.`;
            //     } else if (currentTime.isBetween(start, end)) {
            //         return `The booking duration (${duration}) is currently active. Payment cannot be made.`;
            //     }
            //     return `The booking duration (${duration}) is available.`;
            // });

            return {
                date: court.date,
                duration_time: court.duration_time,
                total_amount: findCourtBooking.total_amount,
                messages: 'not has something yet',
            };
        });

        return {
            findCourtBooking,
            courtAvailableData,
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
