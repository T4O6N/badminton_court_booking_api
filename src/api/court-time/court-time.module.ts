import { Module } from '@nestjs/common';
import { CourtTimeService } from './court-time.service';
import { CourtTimeController } from './court-time.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtTimeController],
    providers: [CourtTimeService, PrismaService],
})
export class CourtTimeModule {}
