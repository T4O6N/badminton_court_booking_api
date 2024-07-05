import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CourtTimeDTO } from './dto/create-court-time.dto';
// import { Cron } from '@nestjs/schedule';
// import * as moment from 'moment';
// import { CourtTimeStatus } from '@prisma/client';

@Injectable()
export class CourtTimeService {
    constructor(private readonly prisma: PrismaService) {}

    async createCourtTime(courtTimeData: CourtTimeDTO) {
        const createdCourtTime = await this.prisma.courtTime.create({
            data: {
                ...courtTimeData,
            },
        });

        return createdCourtTime;
    }

    //NOTE - this is get all court times
    async getCourtTimes() {
        return await this.prisma.courtTime.findMany();
    }

    // @Cron('0 0 * * * *')
    // async handleCourtTimes() {
    //     const courtTimes = await this.prisma.courtTime.findMany();

    //     for (const courtTime of courtTimes) {
    //         const currentTime = moment();
    //         const courtTimeEnd = moment(courtTime.duration_time[1], 'h:mm A');

    //         if (currentTime.isAfter(courtTimeEnd)) {
    //             await this.prisma.courtTime.update({
    //                 where: {
    //                     id: courtTime.id,
    //                 },
    //                 data: {
    //                     status: CourtTimeStatus.expired,
    //                 },
    //             });
    //         }
    //     }
    // }
}
