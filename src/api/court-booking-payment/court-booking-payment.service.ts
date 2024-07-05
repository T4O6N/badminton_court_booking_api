import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { CourtBookingPaymentHistoryDto } from './dto/court-booking-payment-history';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class CourtBookingPaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async createCourtBookingPayment(courtBookingPaymentData: CourtBookingPaymentDto) {
        const findCourtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingPaymentData.court_booking_id,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('this court booking ID is not found');
        }

        const createCourtBookingPayment = await this.prisma.courtBookingPayment.create({
            data: {
                ...courtBookingPaymentData,
                payment_status: PaymentStatus.paided,
            },
            include: {
                court_booking: true,
            },
        });

        await this.prisma.courtBooking.update({
            where: {
                id: courtBookingPaymentData.court_booking_id,
            },
            data: {
                payment_status: PaymentStatus.paided,
            },
        });

        await this.prisma.courtBookingPaymentHistory.create({
            data: {
                booking_payment_id: createCourtBookingPayment.id,
            },
        });

        return createCourtBookingPayment;
    }

    async createCourtBookingPaymentHistory(paymentHistory: CourtBookingPaymentHistoryDto) {
        return await this.prisma.courtBookingPaymentHistory.create({
            data: {
                ...paymentHistory,
            },
        });
    }

    async getCourtBookingPaymentHistory() {
        return await this.prisma.courtBookingPaymentHistory.findMany({
            include: {
                booking_payment: true,
            },
        });
    }

    async getOneCourtBookingPaymentHistory(paymentHistoryId: string) {
        return await this.prisma.courtBookingPaymentHistory.findUnique({
            where: {
                id: paymentHistoryId,
            },
            include: {
                booking_payment: true,
            },
        });
    }
}
