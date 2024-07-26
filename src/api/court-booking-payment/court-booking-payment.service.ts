import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { CourtBookingPaymentHistory } from '@prisma/client';
import * as moment from 'moment-timezone';

@Injectable()
export class CourtBookingPaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async createCourtBookingPayment(courtBookingPaymentData: CourtBookingPaymentDto) {
        try {
            // Check if the court booking exists
            const findCourtBooking = await this.prisma.courtBooking.findUnique({
                where: { id: courtBookingPaymentData.court_booking_id },
            });

            if (!findCourtBooking) {
                throw new BadRequestException('Court booking ID not found.');
            }

            // Check if a payment already exists for this booking
            const existingPayment = await this.prisma.courtBookingPayment.findFirst({
                where: {
                    court_booking_id: courtBookingPaymentData.court_booking_id,
                    court_available_id: courtBookingPaymentData.court_available_id,
                },
            });

            if (existingPayment) {
                throw new BadRequestException('Court booking has already been paid.');
            }

            // Create the court booking payment
            const date = new Date();
            const createCourtBookingPayment = await this.prisma.courtBookingPayment.create({
                data: {
                    ...courtBookingPaymentData,
                    payment_status: 'paided', // Ensure this matches your enum value
                    date: date.toISOString(), // Save date in ISO format
                    payment_time: date.toTimeString(), // Save time in a human-readable format
                },
                include: {
                    court_available: true,
                },
            });

            // Update the court booking status
            await this.prisma.courtBooking.update({
                where: { id: courtBookingPaymentData.court_booking_id },
                data: { payment_status: 'paided' },
            });

            // Create the payment history
            await this.prisma.courtBookingPaymentHistory.create({
                data: {
                    booking_payment_id: createCourtBookingPayment.id,
                    court_available_id: courtBookingPaymentData.court_available_id,
                    device_id: courtBookingPaymentData.device_id,
                },
            });

            // Update weekly income report
            await this.updateWeeklyIncomeReport();

            return createCourtBookingPayment;
        } catch (error) {
            console.error('Error in createCourtBookingPayment:', error);
            throw new InternalServerErrorException('An error occurred while creating court booking payment.');
        }
    }

    async updateWeeklyIncomeReport() {
        try {
            // Fetch payments with status 'PAID'
            const paymentIncome = await this.prisma.courtBookingPayment.findMany({
                where: { payment_status: 'paided' }, // Ensure this matches your enum value
                include: {
                    court_booking: {
                        select: {
                            courtSession: { select: { date: true } },
                        },
                    },
                },
            });

            // Fetch court available data
            const courtAvailables = await this.prisma.courtAvailable.findMany({
                select: {
                    court_booking_id: true,
                    all_total_amount: true,
                },
            });

            // Initialize daily income tracker
            const dailyIncomes: { [key: string]: number } = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
                Sunday: 0,
            };

            // Calculate daily incomes
            paymentIncome.forEach((payment) => {
                const court = payment.court_booking?.courtSession?.[0];
                if (court?.date) {
                    const date = moment(court.date, 'YYYY-MM-DD'); // Adjust date format as needed
                    const dayOfWeek = date.format('dddd');
                    const courtAvailable = courtAvailables.find((ca) => ca.court_booking_id === payment.court_booking_id);
                    const totalAmount = courtAvailable ? +courtAvailable.all_total_amount : 0;

                    if (dailyIncomes[dayOfWeek] !== undefined) {
                        dailyIncomes[dayOfWeek] += totalAmount;
                    }
                }
            });

            const totalWeeklyIncome = Object.values(dailyIncomes).reduce((sum, income) => sum + income, 0);

            const daysArray = Object.entries(dailyIncomes).map(([day, income]) => ({
                day,
                income,
            }));

            // Upsert weekly income report
            const existingReport = await this.prisma.weeklyIncomeReport.findFirst({
                where: {
                    created_at: {
                        gte: moment().startOf('isoWeek').toDate(),
                    },
                },
            });

            if (existingReport) {
                await this.prisma.weeklyIncomeReport.update({
                    where: { id: existingReport.id },
                    data: {
                        days: daysArray,
                        total_weekly_income: totalWeeklyIncome,
                        updated_at: new Date(),
                    },
                });
            } else {
                await this.prisma.weeklyIncomeReport.create({
                    data: {
                        days: daysArray,
                        total_weekly_income: totalWeeklyIncome,
                    },
                });
            }
        } catch (error) {
            console.error('Error in updateWeeklyIncomeReport:', error);
            throw new InternalServerErrorException('An error occurred while updating the weekly income report.');
        }
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
