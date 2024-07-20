import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { CourtBookingPaymentHistory, PaymentStatus } from '@prisma/client';
import { setVientianeTimezone } from 'src/utils/set-timezone';
import * as moment from 'moment-timezone';

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

        // Calculate the day of the week and total amount
        const paymentDate = moment(createCourtBookingPayment.date, 'DD/MM/YYYY');
        const dayOfWeek = paymentDate.format('dddd');
        const totalAmount = +createCourtBookingPayment.court_available.all_total_amount;

        // Find or create the weekly income report for the current week
        const existingReport = await this.prisma.weeklyIncomeReport.findFirst({
            where: {
                created_at: {
                    gte: moment().startOf('isoWeek').toDate(),
                },
            },
        });

        // Parse the days JSON field
        let dailyIncomes: { day: string; income: number }[] = [];
        if (existingReport?.days) {
            try {
                // Debugging: Log the existing days data type and value
                console.log('Existing days data type:', typeof existingReport.days);
                console.log('Existing days data:', existingReport.days);

                // Handle cases where `days` might be an object or a string
                if (typeof existingReport.days === 'string') {
                    dailyIncomes = JSON.parse(existingReport.days) as { day: string; income: number }[];
                } else {
                    dailyIncomes = existingReport.days as unknown as { day: string; income: number }[];
                }
            } catch (error) {
                // Debugging: Log the error
                console.error('Error parsing JSON data:', error);
                throw new Error('Error parsing JSON data for daily incomes');
            }
        }

        // Update or add the income for the specific day
        const dayIndex = dailyIncomes.findIndex((day) => day.day === dayOfWeek);

        if (dayIndex !== -1) {
            dailyIncomes[dayIndex].income += totalAmount;
        } else {
            dailyIncomes.push({ day: dayOfWeek, income: totalAmount });
        }

        const totalWeeklyIncome = dailyIncomes.reduce((sum, day) => sum + day.income, 0);

        // Update or create the weekly income report
        if (existingReport) {
            await this.prisma.weeklyIncomeReport.update({
                where: {
                    id: existingReport.id,
                },
                data: {
                    days: JSON.stringify(dailyIncomes),
                    total_weekly_income: totalWeeklyIncome,
                    updated_at: new Date(),
                },
            });
        } else {
            await this.prisma.weeklyIncomeReport.create({
                data: {
                    days: JSON.stringify(dailyIncomes),
                    total_weekly_income: totalWeeklyIncome,
                },
            });
        }

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
