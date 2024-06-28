import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingHistoryDTO } from './dto/court-booking-history.dto';

@Injectable()
export class CourtBookingHistoryService {
    constructor(private readonly prisma: PrismaService) {}

    async createBookingHistory(courtBookingHistoryData: CourtBookingHistoryDTO) {
        return await this.prisma.courtBookingHistory.create({
            data: {
                ...courtBookingHistoryData,
            },
        });
    }

    async getAllCourtBookingHistory() {
        return await this.prisma.courtBookingHistory.findMany({
            include: {
                courtBooking: true,
            },
        });
    }

    // NOTE - this is get all court bookings history
    async getCourtBookingHistory(courtBookingId: string) {
        return await this.prisma.courtBookingHistory.findUnique({
            where: {
                id: courtBookingId,
            },
            include: {
                courtBooking: true,
            },
        });
    }
}
