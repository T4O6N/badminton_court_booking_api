import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourtTimeService } from './court-time.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtTimeDTO } from './dto/create-court-time.dto';

@ApiTags('CourtTime API')
@Controller('court-time')
export class CourtTimeController {
    constructor(private readonly courtTimeService: CourtTimeService) {}

    @Post()
    @ApiOperation({
        summary: 'Create new court time',
    })
    async createCourtTime(@Body() courtTimeData: CourtTimeDTO) {
        return await this.courtTimeService.createCourtTime(courtTimeData);
    }

    @Get('FindMany')
    @ApiOperation({
        summary: 'Get all court times',
    })
    async getCourtTimes() {
        return await this.courtTimeService.getCourtTimes();
    }
}
