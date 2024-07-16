import { ApiProperty } from '@nestjs/swagger';

export class CourtTimeSlotDTO {
    @ApiProperty({
        required: true,
        description: 'duration time of court time',
        example: ['9:00 AM - 10:00 AM'],
    })
    duration_time: string;

    @ApiProperty({
        required: true,
        description: 'status of duration time',
        example: 'true',
    })
    status: boolean;
}
