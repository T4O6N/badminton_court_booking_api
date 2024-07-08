import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { CourtBookingPaymentHistory, PaymentStatus } from '@prisma/client';

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
                court_available_id: courtBookingPaymentData.court_available_id,
                device_id: courtBookingPaymentData.device_id,
            },
        });

        return createCourtBookingPayment;
    }

    async createCourtBookingPaymentHistory(paymentHistory: CourtBookingPaymentHistory) {
        return await this.prisma.courtBookingPaymentHistory.create({
            data: {
                ...paymentHistory,
            },
        });
    }

    async getCourtBookingPaymentHistory(device_id: string) {
        return await this.prisma.courtBookingPaymentHistory.findMany({
            where: {
                device_id: device_id,
            },
            include: {
                court_available: {
                    select: {
                        totalAllCourtAvailable: true,
                        isExpiredAll: true,
                        all_total_amount: true,
                        date: true,
                        duration_time: true,
                    },
                },
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
