import { PrismaService } from 'src/config/prisma/prisma.service';
import { AdminService } from './admin.service';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

@Module({
    controllers: [AdminController],
    providers: [AdminService, PrismaService],
})
export class AdminModule {}
