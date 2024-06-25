import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CourtsService {
    constructor(private readonly prisma: PrismaService) {}
    async getCourts() {
        const findCourts = await this.prisma.court.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findCourts;
    }

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

    async createCourt(courtData: CreateCourtDto) {
        const createCourt = await this.prisma.court.create({
            data: {
                ...courtData,
            },
        });

        return createCourt;
    }

    async updateCourt(courtId: string, courtData: UpdateCourtDto) {
        await this.getOneCourt(courtId);

        const updateCourt = await this.prisma.court.update({
            where: {
                id: courtId,
            },
            data: {
                ...courtData,
            },
        });

        return updateCourt;
    }

    async deleteCourt(courtId: string) {
        await this.getOneCourt(courtId);

        const deleteCourt = await this.prisma.court.delete({
            where: {
                id: courtId,
            },
        });

        return deleteCourt;
    }
}
