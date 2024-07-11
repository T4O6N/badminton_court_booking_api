import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AdminDTO } from './dto/create-admin.dto';
import { UpdateAdminDTO } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}
    async createAdmin(adminData: AdminDTO) {
        const createdAdmin = await this.prisma.admin.create({
            data: {
                ...adminData,
                is_active: true,
            },
        });

        return createdAdmin;
    }

    async getAdmins() {
        const findAdmins = await this.prisma.admin.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findAdmins;
    }

    async getOneAdmin(adminId: string) {
        const findOneAdmin = await this.prisma.admin.findUnique({
            where: {
                id: adminId,
            },
        });

        return findOneAdmin;
    }

    async updateAdmin(adminId: string, updateAdminData: UpdateAdminDTO) {
        await this.getOneAdmin(adminId);
        const updatedAdmin = await this.prisma.admin.update({
            where: {
                id: adminId,
            },
            data: {
                ...updateAdminData,
            },
        });

        return updatedAdmin;
    }

    async deleteAdmin(adminId: string) {
        await this.getOneAdmin(adminId);

        const deletedAdmin = await this.prisma.admin.delete({
            where: {
                id: adminId,
            },
        });

        return deletedAdmin;
    }
}
