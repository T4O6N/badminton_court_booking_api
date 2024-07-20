import { Injectable } from '@nestjs/common';
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
    }
}
