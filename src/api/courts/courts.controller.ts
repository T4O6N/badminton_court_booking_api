import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
// import { CourtDto } from './dto/create-court.dto';

@ApiTags('Courts')
@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) {}

    @HttpCode(HttpStatus.OK)
    @Get('FindMany')
    @ApiOperation({
        summary: 'find all courts',
    })
    async findAllCourt(): Promise<object> {
        return await this.courtsService.findAllCourt();
    }

    @HttpCode(HttpStatus.OK)
    @Get('ById/:id')
    @ApiOperation({
        summary: 'find court by id',
    })
    async getCourtById(@Param('id') courtId: string): Promise<object> {
        return await this.courtsService.getCourtById(courtId);
    }

    @HttpCode(HttpStatus.OK)
    @Get('ByCourtNumber/:CourtNum')
    async getCourtByNumber(@Param('CourtNum') courtNumber: string): Promise<object> {
        return await this.courtsService.getCourtByNumber(courtNumber);
    }

    // @HttpCode(HttpStatus.OK)
    // @Get('ByCourtTime/:CourtTime')
    // async getCourtByTime(courtTime: string): Promise<object> {
    //     return await this.courtsService.getCourtByTime(courtTime);
    // }

    @HttpCode(HttpStatus.OK)
    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'create new court',
    })
    // async createNewCourt(
    //     @Body()
    //     courtData: CourtDto,
    // ): Promise<object> {
    //     return await this.courtsService.createNewCourt(courtData);
    // }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'update court',
    })
    async updateCourt(@Param('id') courtId: string, @Body() courtData: UpdateCourtDto): Promise<object> {
        return await this.courtsService.updateCourt(courtId, courtData);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('remove/:id')
    @ApiOperation({
        summary: 'delete court',
    })
    async deleteCourt(@Param('id') courtId: string): Promise<object> {
        return await this.courtsService.deleteCourt(courtId);
    }
}
