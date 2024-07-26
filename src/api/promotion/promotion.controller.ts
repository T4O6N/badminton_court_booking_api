import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionDTO } from './dto/create-promotion.dto';
// import { UpdatePromotionDto } from './dto/update-promotion.dto';
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

    @Get()
    @ApiOperation({
        summary: 'get all promotions',
    })
    async getPromotions(@Query('title') title?: string) {
        return await this.promotionService.getPromotions(title);
    }
}
