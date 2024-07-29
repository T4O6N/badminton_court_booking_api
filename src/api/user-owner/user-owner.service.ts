import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserOwnerDTO } from './dto/create-user-owner.dto';
import { UpdateUserOwnerDTO } from './dto/update-user-owner.dto';
import { UserOwner } from '@prisma/client';

@Injectable()
export class UserOwnerService {
    constructor(private readonly prisma: PrismaService) {}

    // NOTE - this is get all user owner
    async getUserOwner(): Promise<UserOwner[]> {
        const findUserOwners = await this.prisma.userOwner.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findUserOwners;
    }

    // NOTE - this is get user owner by id
    async getOneUserOwner(userOwnerId: string): Promise<UserOwner> {
        const findOneUserOwner = await this.prisma.userOwner.findUnique({
            where: {
                id: userOwnerId,
            },
        });

        return findOneUserOwner;
    }

    // NOTE - this is create user owner
    async createOwnerUser(userOwnerData: UserOwnerDTO): Promise<UserOwner> {
        const createdUserOwner = await this.prisma.userOwner.create({
            data: {
                ...userOwnerData,
                is_active: true,
            },
        });

        return createdUserOwner;
    }

    // NOTE - this is update user owner
    async updateUserOwner(userOwnerId: string, updateUserOwnerData: UpdateUserOwnerDTO): Promise<UserOwner> {
        const updatedUserOwner = await this.prisma.userOwner.update({
            where: {
                id: userOwnerId,
            },
            data: {
                ...updateUserOwnerData,
            },
        });

        return updatedUserOwner;
    }

    // NOTE - this is delete user owner
    async deleteUserOwner(userOwnerId: string): Promise<UserOwner> {
        const deletedUserOwner = await this.prisma.userOwner.delete({
            where: {
                id: userOwnerId,
            },
        });

        return deletedUserOwner;
    }

    // async getActiveAdmins(admin_id: string) {
    //     const admin = await this.prisma.admin.findUnique({
    //         where: {
    //             id: admin_id,
    //         },
    //         include: {
    //             courtBookingPaymentHistories: true,
    //         },
    //     });

    //     return admin;
    // }
}
