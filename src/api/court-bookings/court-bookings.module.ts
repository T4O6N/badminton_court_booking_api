import { Module } from '@nestjs/common';
import { CourtBookingsService } from './court-bookings.service';
import { CourtBookingsController } from './court-bookings.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtBookingHistoryService } from '../court-booking-history/court-booking-history.service';

@Module({
    controllers: [CourtBookingsController],
    providers: [CourtBookingsService, CourtBookingHistoryService, PrismaService],
})
export class CourtBookingsModule {}
