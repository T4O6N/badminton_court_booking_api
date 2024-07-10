import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { PrismaService } from 'src/config/prisma/prisma.service';
import * as moment from 'moment-timezone';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getCourtUsedReport() {
        const allCourtNumbers = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1', 'I1', 'J1'];

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

        return dashboardData;
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
                        court: {
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
            const court = Array.isArray(payment.court_booking?.court) ? payment.court_booking?.court[0] : payment.court_booking?.court;
            if (court?.date) {
                const date = moment(court.date, 'DD/MM/YYYY');
                const dayOfWeek = date.format('dddd');
                const courtAvailable = courtAvailables.find((ca) => ca.court_booking_id === payment.court_booking_id);
                const totalAmount = courtAvailable ? +courtAvailable.all_total_amount : 0;
                // Add income to the corresponding day of the week
                switch (dayOfWeek) {
                    case 'Monday':
                        weeklyIncome[0].income_amount += totalAmount;
                        break;
                    case 'Tuesday':
                        weeklyIncome[1].income_amount += totalAmount;
                        break;
                    case 'Wednesday':
                        weeklyIncome[2].income_amount += totalAmount;
                        break;
                    case 'Thursday':
                        weeklyIncome[3].income_amount += totalAmount;
                        break;
                    case 'Friday':
                        weeklyIncome[4].income_amount += totalAmount;
                        break;
                    case 'Saturday':
                        weeklyIncome[5].income_amount += totalAmount;
                        break;
                    case 'Sunday':
                        weeklyIncome[6].income_amount += totalAmount;
                        break;
                    default:
                        break;
                }
            }
        });

        const totalWeeklyIncome = weeklyIncome.reduce((sum, day) => sum + day.income_amount, 0);

        return { weeklyIncome, totalWeeklyIncome };
    }
}
