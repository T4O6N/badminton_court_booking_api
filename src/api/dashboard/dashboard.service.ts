import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
// import * as cron from 'node-cron';
import * as moment from 'moment-timezone';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {
        // cron.schedule('28 1 * * *', this.resetWeeklyIncome.bind(this));
    }

    async CourtUsedReport() {
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

    async weeklyIncomeReport() {
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

        const courtAvailables = await this.prisma.courtAvailable.findMany({
            select: {
                court_booking_id: true,
                all_total_amount: true,
            },
        });

        const dailyIncomes = {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
        };

        for (const payment of paymentIncome) {
            const court = Array.isArray(payment.court_booking?.courtSession)
                ? payment.court_booking?.courtSession[0]
                : payment.court_booking?.courtSession;

            if (court?.date) {
                const date = moment(court.date, 'YYYY-MM-DD');
                const dayOfWeek = date.format('dddd').toLowerCase();
                const courtAvailable = courtAvailables.find((ca) => ca.court_booking_id === payment.court_booking_id);
                const totalAmount = courtAvailable ? +courtAvailable.all_total_amount : 0;

                if (dailyIncomes.hasOwnProperty(dayOfWeek)) {
                    dailyIncomes[dayOfWeek] += totalAmount;
                }
            }
        }

        const totalWeeklyIncome = Object.values(dailyIncomes).reduce((a, b) => a + b, 0);

        const startOfWeekDate = moment().startOf('isoWeek').toDate();
        const existingReport = await this.prisma.incomeReport.findFirst({
            where: {
                created_at: {
                    gte: startOfWeekDate,
                },
            },
        });

        if (existingReport) {
            // Update the existing report
            await this.prisma.incomeReport.update({
                where: { id: existingReport.id },
                data: {
                    monday: dailyIncomes.monday,
                    tuesday: dailyIncomes.tuesday,
                    wednesday: dailyIncomes.wednesday,
                    thursday: dailyIncomes.thursday,
                    friday: dailyIncomes.friday,
                    saturday: dailyIncomes.saturday,
                    sunday: dailyIncomes.sunday,
                    total_weekly_income: totalWeeklyIncome,
                },
            });
        } else {
            // Create a new report
            await this.prisma.incomeReport.create({
                data: {
                    monday: dailyIncomes.monday,
                    tuesday: dailyIncomes.tuesday,
                    wednesday: dailyIncomes.wednesday,
                    thursday: dailyIncomes.thursday,
                    friday: dailyIncomes.friday,
                    saturday: dailyIncomes.saturday,
                    sunday: dailyIncomes.sunday,
                    total_weekly_income: totalWeeklyIncome,
                },
            });
        }

        return {
            monday: dailyIncomes.monday,
            tuesday: dailyIncomes.tuesday,
            wednesday: dailyIncomes.wednesday,
            thursday: dailyIncomes.thursday,
            friday: dailyIncomes.friday,
            saturday: dailyIncomes.saturday,
            sunday: dailyIncomes.sunday,
            total_weekly_income: totalWeeklyIncome,
        };
    }
}
