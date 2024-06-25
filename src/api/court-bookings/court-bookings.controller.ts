import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { CourtBookingsService } from './court-bookings.service';
import { ApiTags } from '@nestjs/swagger';
import { CourtBookingDTO } from './dto/create-court-booking.dto';
import { UpdateCourtDto } from '../courts/dto/update-court.dto';
import { PaymentDTO } from './dto/payment.dto';

@ApiTags('Court-Bookings API')
@Controller('court-booking')
export class CourtBookingsController {
    constructor(private readonly courtBookingsService: CourtBookingsService) {}

    // NOTE - this is Find all courtBooking
    @Get('FindMany')
    async getCourtBookings() {
        return await this.courtBookingsService.getCourtBookings();
    }

    @Get('history')
    async getCourtBookingHistory() {
        return await this.courtBookingsService.getCourtBookingHistory();
    }

    @Get('ById/:id')
    async getCourtBookingById(@Param('id') courtBookingId: string) {
        return await this.courtBookingsService.getCourtBookingById(courtBookingId);
    }

    // NOTE - this is create courtBooking
    @Post()
    async createCourtBooking(@Body() createCourtBookingData: CourtBookingDTO) {
        return await this.courtBookingsService.createCourtBooking(createCourtBookingData);
    }

    @Patch('/:id')
    async updateCourtBooking(@Param('id') courtBookingId: string, courtBookingData: UpdateCourtDto) {
        return await this.courtBookingsService.updateCourtBooking(courtBookingId, courtBookingData);
    }

    @Delete('/:id')
    async deleteCourtBooking(@Param('id') courtBookingId: string) {
        return await this.courtBookingsService.deleteCourtBooking(courtBookingId);
    }

    @Post('payment')
    async courtBookingPayment(@Body() paymentData: PaymentDTO) {
        return await this.courtBookingsService.courtBookingPayment(paymentData);
    }
}
