import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
    constructor(private readonly staffService: StaffService) {}

    @HttpCode(HttpStatus.OK)
    @Get('FindMany')
    async findAllStaff() {
        return await this.staffService.findAllStaff();
    }

    @HttpCode(HttpStatus.OK)
    @Get('ById/:id')
    async findStaffById(@Param('id') staffId: string) {
        return await this.staffService.findStaffById(staffId);
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    async createStaff(@Body() staffData: StaffDto) {
        return this.staffService.createStaff(staffData);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    async update(@Param('id') staffId: string, @Body() staffData: UpdateStaffDto) {
        return await this.staffService.updateStaff(staffId, staffData);
    }

    @HttpCode(HttpStatus.OK)
    @Delete('remove/:id')
    async remove(@Param('id') staffId: string) {
        return await this.staffService.deleteStaff(staffId);
    }
}
