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
        type: ImagePathDto,
        description: 'court image',
        example: {
            filename: 'profile.png',
            path: 'uploads',
            url: 'https://badminton-court-booking-api.onrender.com/uploads/profile.png',
        },
    })
    court_image?: ImagePathDto;

    @ApiProperty({
        required: true,
        description: 'court available',
        example: 'true',
    })
    available: boolean;
}
