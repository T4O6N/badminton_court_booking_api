import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserOwnerService } from './user-owner.service';
import { UserOwnerDTO } from './dto/create-user-owner.dto';
import { UpdateUserOwnerDTO } from './dto/update-user-owner.dto';
import { UserOwner } from '@prisma/client';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('User-Owner API')
@Controller('user-owner')
export class UserOwnerController {
    constructor(private readonly userOwnerService: UserOwnerService) {}

    @Get('FindMany')
    @ApiOperation({
        summary: 'Get all user owner',
    })
    async getUserOwner(): Promise<UserOwner[]> {
        return await this.userOwnerService.getUserOwner();
    }

    @Get('byId/:id')
    @ApiOperation({
        summary: 'Get user owner by id',
    })
    async getOneUserOwner(@Param('id') userOwnerId: string): Promise<UserOwner> {
        return this.userOwnerService.getOneUserOwner(userOwnerId);
    }

    @Post()
    @ApiOperation({
        summary: 'Create user owner',
    })
    async createOwnerUser(@Body() userOwnerData: UserOwnerDTO): Promise<UserOwner> {
        return this.userOwnerService.createOwnerUser(userOwnerData);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update user owner',
    })
    async updateUserOwner(@Param('id') userOwnerId: string, @Body() updateUserOwnerData: UpdateUserOwnerDTO): Promise<UserOwner> {
        return this.userOwnerService.updateUserOwner(userOwnerId, updateUserOwnerData);
    }

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete user owner',
    })
    async deleteUserOwner(@Param('id') userOwnerId: string): Promise<UserOwner> {
        return this.userOwnerService.deleteUserOwner(userOwnerId);
    }

    //NOTE - this is get all active admins
    // @Get('get-active-admin/:id')
    // async getActiveAdmins(@Param('id') admin_id: string) {
    //     return this.userOwnerService.getActiveAdmins(admin_id);
    // }
}
