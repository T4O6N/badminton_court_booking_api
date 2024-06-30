import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingDTO } from './dto/court-booking.dto';
import { UpdateCourtDto } from '../courts/dto/update-court.dto';
import { CourtBookingHistory } from '@prisma/client';

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
        const findCourtBookingById = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
            include: {
                court: true,
            },
        });

        if (!findCourtBookingById) {
            throw new BadRequestException('this court booking ID is not found');
        }

        return findCourtBookingById;
    }

    // NOTE - this is create court booking
    async createCourtBooking(courtBookingData: CourtBookingDTO) {
        const totalAmount = this.calculateTotalAmount(courtBookingData);
        const createCourtBooking = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
                booked_by: courtBookingData.full_name,
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

        await this.prisma.courtBookingHistory.create({
            data: {
                courtBookingId: createCourtBooking.id,
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

    calculateTotalAmount(courtBookingData: CourtBookingDTO): number {
        let totalAmount = 0;
        courtBookingData.court.forEach((court) => {
            totalAmount += court.court_price;
        });
        return totalAmount;
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
                courtBooking: true,
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
                courtBooking: true,
            },
        });
    }
}
