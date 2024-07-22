import { ApiProperty } from '@nestjs/swagger';

export class ImagePathDto {
    @ApiProperty({
        required: true,
        description: 'image name',
        example: 'image name',
    })
    filename?: string;

    @ApiProperty({
        required: true,
        description: 'image path',
        example: 'image path',
    })
    path?: string;

    @ApiProperty({
        required: true,
        description: 'image url',
        example: 'image url',
    })
    url?: string;
}

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
        required: false,
        description: 'court image',
        example: 'court image',
    })
    court_image?: string;
}
