import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CourtBookingDto } from './dto/create-court-booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court-booking.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtBookingsService } from './court-bookings.service';

@ApiTags('Court Booking')
@Controller('court-booking')
export class CourtBookingController {
    constructor(private readonly courtBookingService: CourtBookingsService) {}

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'find all court booking',
    })
    @Get('FindMany')
    async findAllCourtBooking() {
        return await this.courtBookingService.findAllCourtBooking();
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'find one court booking',
    })
    @Get('ById/:id')
    async findOneCourtBooking(@Param('id') courtBookingId: string) {
        return await this.courtBookingService.findCourtBookingById(courtBookingId);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'create court booking',
    })
    @Post()
    async createCourtBooking(
        @Body()
        courtBookingData: CourtBookingDto,
    ) {
        return await this.courtBookingService.createCourtBooking(courtBookingData);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'update court booking',
    })
    @Patch(':id')
    async updateCourtBooking(@Param('id') courtBookingId: string, @Body() courtBookingData: UpdateCourtBookingDto) {
        return this.courtBookingService.updateCourtBooking(courtBookingId, courtBookingData);
    }

    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'delete court booking',
    })
    @Delete('remove/:id')
    async deleteCourtBooking(@Param('id') courtBookingId: string) {
        return await this.courtBookingService.deleteCourtBooking(courtBookingId);
    }
}
