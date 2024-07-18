import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtDTO } from './dto/create-court.dto';

@ApiTags('Courts API')
@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) {}

    @Post()
    @ApiOperation({
        summary: 'Create one court',
    })
    async createCourt(@Body() courtData: CourtDTO) {
        return this.courtsService.createCourt(courtData);
    }

    @Get('FindMany')
    @ApiOperation({
        summary: 'Find all courts',
    })
    async getCourts() {
        return this.courtsService.getCourts();
    }

    @Get('byId/:courtId')
    @ApiOperation({
        summary: 'Find one court by id',
    })
    async getOneCourt(@Param('courtId') courtId: string) {
        return this.courtsService.getOneCourt(courtId);
    }

    @Patch(':courtId')
    @ApiOperation({
        summary: 'Update one court by id',
    })
    async updateCourt(@Param('courtId') courtId: string, @Body() courtData: UpdateCourtDto) {
        return this.courtsService.updateCourt(courtId, courtData);
    }

    @Delete('delete/:courtId')
    @ApiOperation({
        summary: 'Delete one court by id',
    })
    async deleteCourt(@Param('courtId') courtId: string) {
        return this.courtsService.deleteCourt(courtId);
    }
}
