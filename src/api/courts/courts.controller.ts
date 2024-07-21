import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtDTO } from './dto/create-court.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerOptions = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
        },
    }),
};

@ApiTags('Courts API')
@Controller('courts')
export class CourtsController {
    constructor(private readonly courtsService: CourtsService) {}

    @Post()
    @UseInterceptors(FileInterceptor('court_image', multerOptions))
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
        return await this.courtsService.getCourts();
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
