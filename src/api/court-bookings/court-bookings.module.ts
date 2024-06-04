import { Module } from '@nestjs/common';
import { CourtBookingController } from './court-bookings.controller';
import { CourtBookingsService } from './court-bookings.service';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtBookingController],
    providers: [CourtBookingsService, PrismaService],
})
export class CourtBookingModule {}
