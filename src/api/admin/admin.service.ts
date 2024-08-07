import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { AdminDTO } from './dto/create-admin.dto';
import { UpdateAdminDTO } from './dto/update-admin.dto';
import * as moment from 'moment-timezone';

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

        if (!findOneAdmin) {
            throw new BadRequestException('this admin ID is not found');
        }

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

    async getCourtBookingsDailyForAdmin() {
        const today = moment().startOf('day'); // Get the start of the current day

        console.log(today.format('DD/MM/YYYY'));

        const courtBookingHistories = await this.prisma.courtBookingHistory.findMany({
            where: {
                court_booking: {
                    courtSession: {
                        some: {
                            date: today.format('DD/MM/YYYY'), // Filter by today's date
                        },
                    },
                },
            },
            include: {
                court_booking: {
                    select: {
                        id: true,
                        device_id: true,
                        phone: true,
                        full_name: true,
                        court_number: true,
                        payment_status: true,
                        total_amount: true,
                        booked_by: true,
                        created_at: true,
                        updated_at: true,
                    },
                },
            },
        });

        return courtBookingHistories;
    }

    async getAllCourtBookingHistoriesForAdmin() {
        return await this.prisma.courtBookingHistory.findMany({
            include: {
                court_booking: true,
            },
        });
    }
}
