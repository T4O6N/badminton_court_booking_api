import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtDTO } from './dto/create-court.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('Courts API')
@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('court_time', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            }),
        }),
    )
    @ApiOperation({
        summary: 'Create one court',
    })
    async createCourt(@Body() courtData: CourtDTO, @UploadedFile() image: Express.Multer.File) {
        return this.courtsService.createCourt(courtData, image);
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
