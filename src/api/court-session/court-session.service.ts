import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CourtSessionService {
    constructor(private readonly prisma: PrismaService) {}
    //NOTE - this is get all courts
    async getCourtSessions() {
        const findCourts = await this.prisma.courtSession.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findCourts;
    }

    //NOTE - this is get court by id
    async getOneCourtSession(courtId: string) {
        const findOneCourt = await this.prisma.courtSession.findFirst({
            where: {
                id: courtId,
            },
        });

        if (!findOneCourt) {
            throw new BadRequestException('this court ID is not found');
        }

        return findOneCourt;
    }

    async deleteCourtSession(courtId: string) {
        await this.getOneCourtSession(courtId);

        const deletedCourt = await this.prisma.courtSession.delete({
            where: {
                id: courtId,
            },
        });

        return deletedCourt;
    }
}
