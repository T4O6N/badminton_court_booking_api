import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Promotion API')
@Controller('promotion')
export class PromotionController {
    constructor(private readonly promotionService: PromotionService) {}

    @Post()
    @ApiOperation({
        summary: 'create new promotion',
    })
    async createPromotion(@Body() promotionData: PromotionDTO) {
        return await this.promotionService.createPromotion(promotionData);
    }

    @Get('FindMay')
    @ApiOperation({
        summary: 'get all promotions',
    })
    async getPromotions() {
        return await this.promotionService.getPromotions();
    }

    @Get('byId/:promotionId')
    @ApiOperation({
        summary: 'get promotion by id',
    })
    async getOnePromotion(@Param('promotionId') promotionId: string) {
        return await this.promotionService.getOnePromotion(promotionId);
    }

    @Patch(':promotionId')
    @ApiOperation({
        summary: 'update promotion',
    })
    updatePromotion(@Param('promotionId') promotionId: string, @Body() updatePromotionData: UpdatePromotionDto) {
        return this.promotionService.updatePromotion(promotionId, updatePromotionData);
    }

    @Delete('delete/:promotionId')
    @ApiOperation({
        summary: 'delete promotion',
    })
    async deletePromotion(@Param('promotionId') promotionId: string) {
        return this.promotionService.deletePromotion(promotionId);
    }
}
