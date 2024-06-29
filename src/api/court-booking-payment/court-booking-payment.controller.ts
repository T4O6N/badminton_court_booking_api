import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourtBookingPaymentService } from './court-booking-payment.service';
import { CourtBookingPaymentDto } from './dto/court-booking-payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Court-Booking-Payment API')
@Controller('court-booking-payment')
export class CourtBookingPaymentController {
    constructor(private readonly courtBookingPaymentService: CourtBookingPaymentService) {}

    @Post()
    async createCourtBookingPayment(@Body() courtBookingPaymentData: CourtBookingPaymentDto) {
        return await this.courtBookingPaymentService.createCourtBookingPayment(courtBookingPaymentData);
    }

    @Get('payment-history')
    async getCourtBookingPaymentHistory() {
        return await this.courtBookingPaymentService.getCourtBookingPaymentHistory();
    }

    @Get('payment-history/:id')
    async getOneCourtBookingPaymentHistory(@Param('id') paymentHistoryId: string) {
        return await this.courtBookingPaymentService.getOneCourtBookingPaymentHistory(paymentHistoryId);
    }
}
