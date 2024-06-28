import { Controller, Get, Param } from '@nestjs/common';
import { CourtBookingHistoryService } from './court-booking-history.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Court-Booking-History API')
@Controller('court-booking-history')
export class CourtBookingHistoryController {
    constructor(private readonly courtBookingHistoryService: CourtBookingHistoryService) {}

    @Get()
    async getAllCourtBookingHistory() {
        return await this.courtBookingHistoryService.getAllCourtBookingHistory();
    }

    @Get('history/:id')
    async getCourtBookingHistory(@Param('id') courtBookingHistoryId: string) {
        return await this.courtBookingHistoryService.getCourtBookingHistory(courtBookingHistoryId);
    }
}
