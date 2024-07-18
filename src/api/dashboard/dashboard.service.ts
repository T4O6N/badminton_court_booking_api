import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as moment from 'moment-timezone';
import * as cron from 'node-cron';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {
        cron.schedule('28 1 * * *', this.resetWeeklyIncome.bind(this));
    }

    async getCourtUsedReport() {
        const allCourtNumbers = ['A1', 'B2', 'C3', 'D4', 'E5', 'F6', 'G7', 'H8', 'I9', 'J10'];

        const courtBookingCounts = await this.prisma.courtBooking.groupBy({
            by: ['court_number'],
            _count: {
                id: true,
            },
        });

        // Format the data as needed
        const dashboardData = allCourtNumbers.map((courtNumber) => {
            const courtData = courtBookingCounts.find((item) => item.court_number === courtNumber);

            return {
                court_number: courtNumber,
                booking_count: courtData ? courtData._count.id : 0,
            };
        });

        const reports = await Promise.all(
            dashboardData.map(async (data) => {
                const existingReport = await this.prisma.courtUsedReport.findFirst({
                    where: {
                        court_used: data.court_number,
                    },
                });

                if (existingReport) {
                    const updatedReport = await this.prisma.courtUsedReport.update({
                        where: {
                            id: existingReport.id,
                        },
                        data: {
                            booking_count: data.booking_count,
                            updated_at: new Date(),
                        },
                    });

                    return updatedReport;
                } else {
                    const newReport = await this.prisma.courtUsedReport.create({
                        data: {
                            court_used: data.court_number,
                            booking_count: data.booking_count,
                        },
                    });

                    return newReport;
                }
            }),
        );

        return reports;
    }

    async getIncomeReport() {
        // Step 1: Get income from CourtBookingPayment
        const paymentIncome = await this.prisma.courtBookingPayment.findMany({
            where: {
                payment_status: PaymentStatus.paided,
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

        // Step 3: Prepare an array to store income for each day of the week
        const weeklyIncome = [
            { day: 'Monday', income_amount: 0 },
            { day: 'Tuesday', income_amount: 0 },
            { day: 'Wednesday', income_amount: 0 },
            { day: 'Thursday', income_amount: 0 },
            { day: 'Friday', income_amount: 0 },
            { day: 'Saturday', income_amount: 0 },
            { day: 'Sunday', income_amount: 0 },
        ];

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
                const dayIndex = weeklyIncome.findIndex((day) => day.day === dayOfWeek);

                if (dayIndex !== -1) {
                    weeklyIncome[dayIndex].income_amount += totalAmount;
                }
            }
        });

        const totalWeeklyIncome = weeklyIncome.reduce((sum, day) => sum + day.income_amount, 0);

        await Promise.all(
            weeklyIncome.map(async (day) => {
                const existingReport = await this.prisma.weeklyIncomeReport.findFirst({
                    where: {
                        day: day.day,
                    },
                });

                if (existingReport) {
                    return await this.prisma.weeklyIncomeReport.update({
                        where: {
                            id: existingReport.id,
                        },
                        data: {
                            income_amount: day.income_amount,
                            total_weekly_income: day.income_amount,
                            updated_at: new Date(),
                        },
                    });
                } else {
                    return await this.prisma.weeklyIncomeReport.create({
                        data: {
                            day: day.day,
                            income_amount: day.income_amount,
                            total_weekly_income: day.income_amount,
                            created_at: new Date(),
                            updated_at: new Date(),
                        },
                    });
                }
            }),
        );

        return { weeklyIncome, totalWeeklyIncome };
    }

    private async resetWeeklyIncome() {
        await this.prisma.weeklyIncomeReport.updateMany({
            data: {
                total_weekly_income: 0,
                updated_at: new Date(),
            },
        });
    }
}
