import { Module } from '@nestjs/common';
import { UserOwnerService } from './user-owner.service';
import { UserOwnerController } from './user-owner.controller';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Module({
    controllers: [UserOwnerController],
    providers: [UserOwnerService, PrismaService],
})
export class UserOwnerModule {}
