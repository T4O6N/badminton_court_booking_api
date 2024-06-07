import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { StaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Injectable()
export class StaffService {
    constructor(private readonly prisma: PrismaService) {}

    async findAllStaff(): Promise<object> {
        const findStaff = await this.prisma.staff.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findStaff;
    }

    async findStaffById(staffId: string): Promise<object> {
        const findStaff = await this.prisma.staff.findFirst({
            where: {
                id: staffId,
            },
        });

        if (!findStaff) {
            throw new BadRequestException('Staff not found in database');
        }

        return findStaff;
    }

    async createStaff(staffData: StaffDto): Promise<object> {
        const newStaffData = await this.prisma.staff.create({
            data: {
                ...staffData,
                is_active: true,
            },
        });

        return newStaffData;
    }

    async updateStaff(staffId: string, staffData: UpdateStaffDto) {
        const findUser = await this.prisma.staff.findFirst({
            where: {
                id: staffId,
            },
        });

        if (!findUser) {
            throw new BadRequestException('Staff not found in database');
        }

        const updateStaffData = await this.prisma.staff.update({
            where: {
                id: staffId,
            },
            data: {
                ...staffData,
            },
        });

        return updateStaffData;
    }

    async deleteStaff(staffId: string): Promise<object> {
        const findUser = await this.prisma.staff.findFirst({
            where: {
                id: staffId,
            },
        });

        if (!findUser) {
            throw new BadRequestException('Staff not found in database');
        }

        const deleteStaffData = await this.prisma.staff.delete({
            where: {
                id: staffId,
            },
        });

        return deleteStaffData;
    }
}
