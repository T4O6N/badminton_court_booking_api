import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtDTO } from './dto/create-court.dto';
import { Prisma } from '@prisma/client';
import { FirebaseService } from 'src/utils/firebase/firebase.service';

@Injectable()
export class CourtsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly firebaseService: FirebaseService,
    ) {}

    //NOTE - this is get all courts
    async getCourts() {
        const findCourts = await this.prisma.court.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findCourts;
    }

    //NOTE - this is get court by id
    async getOneCourt(courtId: string) {
        const findOneCourt = await this.prisma.court.findFirst({
            where: {
                id: courtId,
            },
        });

        if (!findOneCourt) {
            throw new BadRequestException('this court ID is not found');
        }

        return findOneCourt;
    }

    //NOTE - this is create court
    async createCourt(courtData: CourtDTO) {
        const createdCourt = await this.prisma.court.create({
            data: {
                ...courtData,
                court_image: courtData.court_image as Prisma.JsonValue,
                available: true,
            },
        });

        return createdCourt;
    }

    async updateCourt(courtId: string, courtData: UpdateCourtDto) {
        await this.getOneCourt(courtId);

        const updatedCourt = await this.prisma.court.update({
            where: {
                id: courtId,
            },
            data: {
                ...courtData,
                court_image: courtData.court_image as Prisma.JsonValue,
            },
        });

        return updatedCourt;
    }

    async deleteCourt(courtId: string) {
        await this.getOneCourt(courtId);

        const deletedCourt = await this.prisma.court.delete({
            where: {
                id: courtId,
            },
        });

        return deletedCourt;
    }

    async uploadImage(file: Express.Multer.File) {
        const storage = this.firebaseService.getStorageInstance();

        const bucket = storage.bucket();

        const fileName = `${Date.now()}-${file.originalname}`;

        const fileUpload = bucket.file(`courts/${fileName}`);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        await new Promise((resolve, reject) => {
            stream.on('error', (err) => {
                reject(err);
            });

            stream.on('finish', () => {
                resolve(fileName);
            });

            stream.end(file.buffer);
        });

        const [url] = await fileUpload.getSignedUrl({
            action: 'read',
            expires: '12-31-9999',
        });

        return {
            filename: file.originalname,
            path: 'banners/',
            url,
        };
    }
}
