import { Module } from '@nestjs/common';
import { CourtBookingsService } from './court-bookings.service';
import { CourtBookingsController } from './court-bookings.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtBookingsController],
    providers: [CourtBookingsService, PrismaService],
})
export class CourtBookingsModule {}
