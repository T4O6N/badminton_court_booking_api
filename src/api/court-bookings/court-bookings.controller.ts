import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CourtBookingsService } from './court-bookings.service';
import { ApiTags } from '@nestjs/swagger';
import { CourtBookingDto } from './dto/create-court-booking.dto';

@ApiTags('Court Bookings')
@Controller('court-booking')
export class CourtBookingsController {
    constructor(private readonly courtBookingsService: CourtBookingsService) {}

    // NOTE - this is Find all courtBooking
    @Get('FindMany')
    async findAll() {
        return await this.courtBookingsService.getCourtBookings();
    }

    // NOTE - this is Find courtBooking History
    @Get('History')
    async getCourtBookingHistory() {
        return await this.courtBookingsService.getCourtBookingHistory();
    }

    // NOTE - this is Find courtBooking By Id
    @Get('ById/:id')
    async getCourtBookingById(@Param('id') courtBookingId: string) {
        return await this.courtBookingsService.getCourtBookingById(courtBookingId);
    }

    // NOTE - this is create courtBooking
    @Post()
    async createCourtBooking(@Body() createCourtBookingData: CourtBookingDto) {
        return await this.courtBookingsService.createCourtBooking(createCourtBookingData);
    }

    // NOTE - this is delete courtBooking
    @Delete(':id')
    async deleteCourtBooking(@Param('id') courtBookingId: string) {
        return await this.courtBookingsService.deleteCourtBooking(courtBookingId);
    }
}
