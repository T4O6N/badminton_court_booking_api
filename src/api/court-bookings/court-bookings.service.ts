import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingDto } from './dto/create-court-booking.dto';
import { validateMongodbID } from 'src/utils/id.utill';

@Injectable()
export class CourtBookingsService {
    constructor(private readonly prisma: PrismaService) {}

    // NOTE - this is get all court bookings
    async getCourtBookings() {
        return await this.prisma.courtBooking.findMany({
            orderBy: {
                created_at: 'desc',
            },
            include: {
                court: true,
            },
        });
    }

    // NOTE - this is get all court bookings hsitory
    async getCourtBookingHistory() {
        return await this.prisma.courtBooking.findMany({
            orderBy: {
                created_at: 'desc',
            },
            include: {
                court: true,
            },
        });
    }

    // NOTE - thsis is get court booking by id
    async getCourtBookingById(courtBookingId: string) {
        await validateMongodbID(courtBookingId);

        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
            include: {
                court: true,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('This Court booking ID not found in database');
        }

        return findCourtBooking;
    }

    // NOTE - this is create court booking
    async createCourtBooking(courtBookingData: CourtBookingDto) {
        const totalAmount = this.calculateTotalAmount(courtBookingData);

        const createCourtBooking = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
                booked_by: courtBookingData.first_name,
                total_amount: totalAmount,
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

        return createCourtBooking;
    }

    // NOTE - this is delete court booking
    async deleteCourtBooking(courtBookingId: string) {
        const courtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
            include: {
                court: true,
            },
        });

        if (!courtBooking) {
            throw new BadRequestException(`This Court booking ID not found in database`);
        }

        const courtId = courtBooking.court.map((court) => court.id);

        if (courtId.length > 0) {
            await this.prisma.court.deleteMany({
                where: {
                    id: { in: courtId },
                },
            });
        }

        const deleteResult = await this.prisma.courtBooking.delete({
            where: {
                id: courtBookingId,
            },
        });

        return deleteResult;
    }

    calculateTotalAmount(courtBookingData: CourtBookingDto): number {
        let totalAmount = 0;
        courtBookingData.court.forEach((court) => {
            totalAmount += court.court_price;
        });
        return totalAmount;
    }
}
