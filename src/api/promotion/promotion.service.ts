import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PromotionDTO } from './dto/create-promotion.dto';
// import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
    constructor(private readonly prisma: PrismaService) {}

    //NOTE - this is create promotion
    async createPromotion(promotionData: PromotionDTO) {
        return this.prisma.promotion.create({
            data: {
                ...promotionData,
            },
        });
    }

    //NOTE - this is get all promotions
    async getPromotions(title: string) {
        const promotions = await this.prisma.promotion.findFirst({
            where: {
                title: title,
            },
        });

        return promotions;
    }
}
