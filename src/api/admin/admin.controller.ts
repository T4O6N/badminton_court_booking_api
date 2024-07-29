import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateAdminDTO } from './dto/update-admin.dto';
import { AdminDTO } from './dto/create-admin.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin API')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get('FindMany')
    @ApiOperation({
        summary: 'Get all admins',
    })
    async getAdmins() {
        return this.adminService.getAdmins();
    }

    @Post()
    @ApiOperation({
        summary: 'Create new admin',
    })
    async createAdmin(@Body() adminData: AdminDTO) {
        return await this.adminService.createAdmin(adminData);
    }

    @Get('byId/:id')
    @ApiOperation({
        summary: 'Get one admin by ID',
    })
    async getOneAdmin(@Param('id') adminIdd: string) {
        return this.adminService.getOneAdmin(adminIdd);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update admin by ID',
    })
    async updateAdmin(@Param('id') adminId: string, @Body() updateAdminData: UpdateAdminDTO) {
        return this.adminService.updateAdmin(adminId, updateAdminData);
    }

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete admin by ID',
    })
    async deleteAdmin(@Param('id') adminId: string) {
        return await this.adminService.deleteAdmin(adminId);
    }

    @Get('/daily/court-booking-history')
    async getCourtBookingsForAdmin() {
        return this.adminService.getCourtBookingsDailyForAdmin();
    }

    @Get('court-booking-history')
    async getAllCourtBookingHistory() {
        return await this.adminService.getAllCourtBookingHistoriesForAdmin();
    }
}
