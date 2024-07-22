// import { Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { PrismaService } from 'src/config/prisma/prisma.service';

// export class TotalWeeklyCronService {
//     private readonly logger = new Logger(TotalWeeklyCronService.name);

//     constructor(private readonly prisma: PrismaService) {}

//     @Cron(CronExpression.EVERY_WEEK)
//     async handleCron() {
//         this.logger.debug('running cron jon to check total weekly income');

//         const updatedWeeklyTotalAmount = await this.prisma.weeklyIncomeReport.updateMany({
//             data: {
//                 total_weekly_income: 0,
//                 updated_at: new Date(),
//             },
//         });

//         this.logger.debug('update total weekly income');

//         return updatedWeeklyTotalAmount;
//     }
// }
