import { Module } from '@nestjs/common';
import { CourtBookingPaymentService } from './court-booking-payment.service';
import { CourtBookingPaymentController } from './court-booking-payment.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtBookingPaymentController],
    providers: [CourtBookingPaymentService, PrismaService],
})
export class CourtBookingPaymentModule {}
