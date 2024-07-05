import { ApiProperty } from '@nestjs/swagger';
// import { CourtTimeStatus } from '@prisma/client';

export class CourtTimeDTO {
    // @ApiProperty({
    //     type: String,
    //     description: 'status of court time',
    //     example: 'booked',
    // })
    // status: CourtTimeStatus;

    @ApiProperty({
        type: [String],
        description: 'duration time of court time',
        example: ['9:00 AM - 10:00 AM'],
    })
    duration_time: string[];
}
