import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { CourtBookingPaymentHistory, PaymentStatus } from '@prisma/client';
import { setVientianeTimezone } from 'src/utils/set-timezone';

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

        // Check if a payment already exists for this court booking
        const existingPayment = await this.prisma.courtBookingPayment.findFirst({
            where: {
                OR: [
                    { court_booking_id: courtBookingPaymentData.court_booking_id },
                    { court_available_id: courtBookingPaymentData.court_available_id },
                ],
            },
        });

        if (existingPayment) {
            throw new BadRequestException('Court booking has already been paid!!');
        }

        const date = new Date();
        const createCourtBookingPayment = await this.prisma.courtBookingPayment.create({
            data: {
                ...courtBookingPaymentData,
                payment_status: PaymentStatus.paided,
                date: setVientianeTimezone(date).fullDate,
                payment_time: setVientianeTimezone(date).time,
            },
            include: {
                court_available: true,
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
            orderBy: {
                created_at: 'desc',
            },
            where: {
                device_id: device_id,
            },
            include: {
                booking_payment: {
                    select: {
                        date: true,
                        payment_time: true,
                        court_booking: {
                            select: {
                                phone: true,
                                full_name: true,
                                court_number: true,
                            },
                        },
                    },
                },
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
