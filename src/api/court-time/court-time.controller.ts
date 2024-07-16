import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CourtTimeService } from './court-time.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtTimeSlotDTO } from './dto/create-court-time.dto';

@ApiTags('Court-Time API')
@Controller('court-time')
export class CourtTimeController {
    constructor(private readonly courtTimeService: CourtTimeService) {}

    @Post()
    @ApiOperation({
        summary: 'Create new court time slot',
    })
    async createCourtTime(@Body() courtTimeData: CourtTimeSlotDTO) {
        return await this.courtTimeService.createCourtTimeSlot(courtTimeData);
    }

    @Get('FindMany')
    @ApiOperation({
        summary: 'Get all court time slots',
    })
    async getCourtTimes() {
        return await this.courtTimeService.getCourtTimeSlots();
    }

    @Get('byId/:courtTimeSlotId')
    @ApiOperation({
        summary: 'Get one court time slot',
    })
    async getCourtTimeSlot(@Param('id') courtTimeSlotId: string) {
        return await this.courtTimeService.getOneCourtTimeSlot(courtTimeSlotId);
    }
}
