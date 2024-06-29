import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Court API')
@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) {}

    @Get('FindMany')
    @ApiOperation({
        summary: 'Find all courts',
    })
    async getCourts() {
        return this.courtsService.getCourts();
    }

    @Get('ById/:id')
    @ApiOperation({
        summary: 'Find one court',
    })
    async getOneCourt(@Param('id') courtId: string) {
        return this.courtsService.getOneCourt(courtId);
    }

    @Post()
    @ApiOperation({
        summary: 'Create one court',
    })
    async createCourt(@Body() courtData: CourtDto) {
        return this.courtsService.createCourt(courtData);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update one court',
    })
    async updateCourt(@Param('id') courtId: string, @Body() courtData: UpdateCourtDto) {
        return this.courtsService.updateCourt(courtId, courtData);
    }

    @Delete('remove/:id')
    @ApiOperation({
        summary: 'Delete one court',
    })
    async deleteCourt(@Param('id') courtId: string) {
        return this.courtsService.deleteCourt(courtId);
    }
}
