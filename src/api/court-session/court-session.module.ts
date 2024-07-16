import { Module } from '@nestjs/common';
import { CourtSessionService } from './court-session.service';
import { CourtSessionController } from './court-session.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
  controllers: [CourtSessionController],
  providers: [CourtSessionService, PrismaService],
})
export class CourtSessionModule {}
