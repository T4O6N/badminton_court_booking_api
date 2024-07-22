import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { UpdateCourtDto } from './dto/update-court.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourtDTO } from './dto/create-court.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from 'src/config/firebase/firebase.service';

@ApiTags('Courts API')
@Controller('courts')
export class CourtsController {
    constructor(
        private readonly courtsService: CourtsService,
        private readonly firebaseService: FirebaseService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Create one court',
    })
    @UseInterceptors(FileInterceptor('court_image'))
    async createCourt(@Body() courtData: CourtDTO, @UploadedFile() court_image: Express.Multer.File) {
        let imageUrl: string | null = null;
        if (court_image) {
            const uploadResult = await this.firebaseService.uploadImage(court_image);
            imageUrl = uploadResult.url;
        }
        return this.courtsService.createCourt(courtData, imageUrl);
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
