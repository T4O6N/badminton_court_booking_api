import { ApiProperty } from '@nestjs/swagger';

export class CourtSessionDTO {
    @ApiProperty({
        type: String,
        description: 'Date of court',
        example: '2022-01-01',
    })
    date: string;

    @ApiProperty({
        description: 'Duration time of court',
        example: '9:00 AM - 10:00 AM',
    })
    duration_time: string[];
}
