import { Module } from '@nestjs/common';
import { CourtBookingHistoryService } from './court-booking-history.service';
import { CourtBookingHistoryController } from './court-booking-history.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtBookingHistoryController],
    providers: [CourtBookingHistoryService, PrismaService],
})
export class CourtBookingHistoryModule {}
