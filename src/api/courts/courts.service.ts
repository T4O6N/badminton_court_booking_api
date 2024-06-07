import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
// import { CourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';
import { validateMongodbID } from 'src/utils/id.utill';
// import { isEmpty } from 'src/utils/util';
import { courtNum } from '@prisma/client';
// import { CourtDto } from './dto/create-court.dto';

@Injectable()
export class CourtsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllCourt() {
        const findCourts = await this.prisma.court.findMany({
            orderBy: { created_at: 'desc' },
        });
        return findCourts;
    }

    async getCourtById(courtId: string): Promise<object> {
        await validateMongodbID(courtId);

        const findCourt = await this.prisma.court.findFirst({
            where: {
                id: courtId,
            },
        });

        if (!findCourt) {
            throw new BadRequestException('Court not found in database');
        }

        return findCourt;
    }

    async getCourtByNumber(courtNumber: string): Promise<object> {
        const findCourt = await this.prisma.court.findFirst({
            where: {
                court_number: {
                    equals: courtNumber as courtNum,
                },
            },
        });

        return findCourt;
    }

    // async getCourtByTime(courtTime: string): Promise<object> {
    //     const findCourtByTime = await this.prisma.court.findFirst({
    //         where: {
    //             start_time: {
    //                 equals: courtTime,
    //             },
    //             end_time: {
    //                 equals: courtTime,
    //             },
    //         },
    //     });

    //     return findCourtByTime;
    // }

    // async createNewCourt(courtData: CourtDto): Promise<object> {
    //     if (isEmpty(courtData)) {
    //         throw new BadRequestException('Court data is empty');
    //     }

    //     const createCourtData = await this.prisma.court.create({
    //         data: {
    //             ...courtData,
    //             // is_active: true,
    //         },
    //     });
    //     return createCourtData;
    // }

    async updateCourt(courtId: string, courtData: UpdateCourtDto): Promise<object> {
        const findCourt = await this.prisma.court.findFirst({
            where: {
                id: courtId,
            },
        });

        if (!findCourt) {
            throw new BadRequestException('Court not found in databsae');
        }

        const updateCourt = await this.prisma.court.update({
            where: {
                id: courtId,
            },
            data: {
                ...courtData,
                // is_update_info: true,
            },
        });

        return updateCourt;
    }

    async deleteCourt(courtId: string): Promise<object> {
        await validateMongodbID(courtId);

        const findCourt = await this.prisma.court.findFirst({
            where: {
                id: courtId,
            },
        });

        if (!findCourt) {
            throw new BadRequestException('Court not found in databsae');
        }

        const deleteCourt = await this.prisma.court.delete({
            where: {
                id: courtId,
            },
        });

        return deleteCourt;
    }
}
