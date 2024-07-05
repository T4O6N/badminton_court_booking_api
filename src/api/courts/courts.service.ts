import { BadRequestException, Injectable } from '@nestjs/common';
import { CourtDTO } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CourtsService {
    constructor(private readonly prisma: PrismaService) {}

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
}
