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

    async weeklyIncomeReport() {
        try {
            // Step 1: Get income from CourtBookingPayment
            const paymentIncome = await this.prisma.courtBookingPayment.findMany({
                where: {
                    payment_status: 'paided',
                },
                include: {
                    court_booking: {
                        select: {
                            courtSession: {
                                select: {
                                    date: true,
                                },
                            },
                        },
                    },
                },
            });

            // Step 2: Get total amount from CourtAvailable
            const courtAvailables = await this.prisma.courtAvailable.findMany({
                select: {
                    court_booking_id: true,
                    all_total_amount: true,
                },
            });

            // Step 3: Prepare an object to store income for each day of the week
            const dailyIncomes: { [key: string]: number } = {
                Monday: 0,
                Tuesday: 0,
                Wednesday: 0,
                Thursday: 0,
                Friday: 0,
                Saturday: 0,
                Sunday: 0,
            };

            // Step 4: Aggregate income by day of the week
            paymentIncome.forEach((payment) => {
                const court = Array.isArray(payment.court_booking?.courtSession)
                    ? payment.court_booking?.courtSession[0]
                    : payment.court_booking?.courtSession;

                if (court?.date) {
                    const date = moment(court.date, 'DD/MM/YYYY');
                    const dayOfWeek = date.format('dddd');
                    const courtAvailable = courtAvailables.find((ca) => ca.court_booking_id === payment.court_booking_id);
                    const totalAmount = courtAvailable ? +courtAvailable.all_total_amount : 0;

                    if (dailyIncomes.hasOwnProperty(dayOfWeek)) {
                        dailyIncomes[dayOfWeek] += totalAmount;
                    }
                }
            });

            const totalWeeklyIncome = Object.values(dailyIncomes).reduce((sum, income) => sum + income, 0);

            // Convert daily incomes to JSON format
            const daysArray = Object.entries(dailyIncomes).map(([day, income]) => ({
                day,
                income,
            }));

            // Check if a report already exists for the current week
            const existingReport = await this.prisma.weeklyIncomeReport.findFirst({
                where: {
                    created_at: {
                        gte: moment().startOf('isoWeek').toDate(), // Adjust query as needed
                    },
                },
            });

            if (existingReport) {
                await this.prisma.weeklyIncomeReport.update({
                    where: {
                        id: existingReport.id,
                    },
                    data: {
                        days: daysArray.length > 0 ? daysArray : [], // Ensure days is not null
                        total_weekly_income: totalWeeklyIncome,
                        updated_at: new Date(),
                    },
                });
            } else {
                await this.prisma.weeklyIncomeReport.create({
                    data: {
                        days: daysArray.length > 0 ? daysArray : [], // Ensure days is not null
                        total_weekly_income: totalWeeklyIncome,
                    },
                });
            }

            return { days: daysArray, totalWeeklyIncome };
        } catch (error) {
            console.error('Error in weeklyIncomeReport:', error);
            throw error;
        }
    }
}
