import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtTimeSlotDTO } from './dto/create-court-time.dto';

@Injectable()
export class CourtTimeService {
    constructor(private readonly prisma: PrismaService) {}

    async createCourtTimeSlot(courtTimeData: CourtTimeSlotDTO) {
        const createdCourtTime = await this.prisma.courtTime.create({
            data: {
                ...courtTimeData,
            },
        });

        return createdCourtTime;
    }

    //NOTE - this is get all court times
    async getCourtTimeSlots() {
        return await this.prisma.courtTime.findMany({
            orderBy: {
                created_at: 'asc',
            },
        });
    }

    async getOneCourtTimeSlot(courtTimeSlotId: string) {
        const findOneCourtTimeSlot = await this.prisma.courtTime.findFirst({
            where: {
                id: courtTimeSlotId,
            },
        });

        if (!findOneCourtTimeSlot) {
            throw new BadRequestException('this court time ID is not found');
        }

        return findOneCourtTimeSlot;
    }
}
