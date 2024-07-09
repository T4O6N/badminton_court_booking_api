import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';
import { subWeeks, format, parseISO, getDay } from 'date-fns';
import { PrismaService } from 'src/config/prisma/prisma.service';

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
        const startDate = subWeeks(new Date(), 1);
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');

        const courtBookings = await this.prisma.courtBooking.findMany({
            where: {
                payment_status: PaymentStatus.paided,
                created_at: {
                    gte: new Date(formattedStartDate),
                },
            },
            include: {
                court: true,
            },
        });

        const incomeReport = courtBookings.reduce((acc, booking) => {
            booking.court.forEach((court) => {
                if (!acc[court.date]) {
                    acc[court.date] = 0;
                }
                acc[court.date];
            });
            return acc;
        }, {});

        const getDayOfWeek = (dateString) => {
            const date = parseISO(dateString);
            const dayIndex = getDay(date);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            return days[dayIndex];
        };

        const formattedIncomeReport = Object.entries(incomeReport).map(([court_date, income_amount]) => ({
            day: getDayOfWeek(court_date),
            income_amount,
        }));

        return formattedIncomeReport;
    }
}
