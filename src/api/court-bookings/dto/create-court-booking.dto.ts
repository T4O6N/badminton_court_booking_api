import { ApiProperty } from '@nestjs/swagger';
import { CourtDto } from 'src/api/courts/dto/create-court.dto';

export class CourtBookingDto {
    @ApiProperty({
        required: true,
        type: String,
    })
    public phone: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public first_name: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public last_name: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public email: string;

    @ApiProperty({
        type: [CourtDto],
        example: '',
    })
    public court: CourtDto[];

    @ApiProperty({
        type: Number,
    })
    public limitDay: number;

    @ApiProperty({
        type: String,
    })
    public booked_by: string;
}
