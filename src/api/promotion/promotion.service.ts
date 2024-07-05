import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { PromotionDTO } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionService {
    constructor(private readonly prisma: PrismaService) {}

    //NOTE - this is create promotion
    async createPromotion(promotionData: PromotionDTO) {
        const createdPromotion = await this.prisma.promotion.create({
            data: {
                ...promotionData,
            },
        });

        return createdPromotion;
    }

    //NOTE - this is get all promotions
    async getPromotions() {
        const findPromotions = await this.prisma.promotion.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findPromotions;
    }

    //NOTE - this is get promotion by id
    async getOnePromotion(promotionId: string) {
        const findOnePromotion = await this.prisma.promotion.findFirst({
            where: {
                id: promotionId,
            },
        });

        return findOnePromotion;
    }

    //NOTE - this is update promotion
    async updatePromotion(promotionId: string, updatePromotionData: UpdatePromotionDto) {
        await this.getOnePromotion(promotionId);

        const updatedPromotion = await this.prisma.promotion.update({
            where: {
                id: promotionId,
            },
            data: {
                ...updatePromotionData,
            },
        });

        return updatedPromotion;
    }

    //NOTE - this is delete promotion
    async deletePromotion(promotionId: string) {
        await this.getOnePromotion(promotionId);

        const deletedPromotion = await this.prisma.promotion.delete({
            where: {
                id: promotionId,
            },
        });

        return deletedPromotion;
    }
}
