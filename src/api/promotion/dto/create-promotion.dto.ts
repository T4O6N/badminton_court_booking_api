import { ApiProperty } from '@nestjs/swagger';

export class PromotionDTO {
    @ApiProperty({
        type: String,
        description: 'title of the promotion',
        example: 'ສ່ວນຫຼຸດເດີ່ນ',
    })
    title: string;

    @ApiProperty({
        type: Number,
        description: 'discount of the promotion',
        example: '20000',
    })
    discount: number;
}
