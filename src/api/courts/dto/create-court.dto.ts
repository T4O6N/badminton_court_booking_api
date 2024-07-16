import { ApiProperty } from '@nestjs/swagger';

export class CourtDTO {
    @ApiProperty({
        required: true,
        description: 'court number',
        example: 'A1',
    })
    court_number: string;

    @ApiProperty({
        required: true,
        description: 'court description',
        example: 'court description',
    })
    description: string;

    @ApiProperty({
        required: true,
        description: 'court image',
        example: 'court image',
    })
    court_image: string;

    @ApiProperty({
        required: true,
        description: 'court available',
        example: 'true',
    })
    available: boolean;
}
