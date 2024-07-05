import { PartialType } from '@nestjs/mapped-types';
import { PromotionDTO } from './create-promotion.dto';

export class UpdatePromotionDto extends PartialType(PromotionDTO) {}
