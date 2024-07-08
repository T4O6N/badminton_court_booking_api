import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) {}

    async getDashboard() {
        const courtBookingCounts = await this.prisma.courtBooking.groupBy({
            by: ['court_number'],
            _count: {
                id: true,
            },
        });

        // Format the data as needed
        const dashboardData = courtBookingCounts.map((count) => ({
            court_number: count.court_number,
            booking_count: count._count.id,
        }));

        return dashboardData;
    }
}
