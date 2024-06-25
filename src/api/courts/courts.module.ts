import { Module } from '@nestjs/common';
import { CourtsService } from './courts.service';
import { CourtsController } from './courts.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [CourtsController],
    providers: [CourtsService, PrismaService],
})
export class CourtsModule {}
