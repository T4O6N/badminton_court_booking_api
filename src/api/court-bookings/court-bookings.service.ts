import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingDTO } from './dto/court-booking.dto';
import { UpdateCourtDto } from '../courts/dto/update-court.dto';
import { PaymentDTO } from './dto/payment.dto';
import { CourtBookingHistoryService } from '../court-booking-history/court-booking-history.service';

@Injectable()
export class CourtBookingsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly courtBookingHistory: CourtBookingHistoryService,
    ) {}

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

        await this.courtBookingHistory.createBookingHistory({
            courtBookingId: createCourtBooking.id,
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

    //!SECTION - PAYMENT

    async courtBookingPayment(paymentData: PaymentDTO) {
        const bookingId = await this.prisma.courtBooking.findUnique({
            where: {
                id: paymentData.bookingId,
            },
        });

        if (!bookingId) {
            throw new BadRequestException('this court booking ID is not found');
        }

        const updatedBooking = await this.prisma.courtBooking.update({
            where: {
                id: paymentData.bookingId,
            },
            data: {
                payment_Status: paymentData.payment_Status,
            },
        });

        return updatedBooking;
    }
}
