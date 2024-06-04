import { ApiProperty } from '@nestjs/swagger';

enum courtNum {
    A1 = 'A1',
    B1 = 'B1',
    C1 = 'C1',
    D1 = 'D1',
    E1 = 'E1',
    F1 = 'F1',
    G1 = 'G1',
    H1 = 'H1',
    I1 = 'I1',
    J1 = 'J1',
}

export class CourtDto {
    @ApiProperty({
        required: true,
        enum: courtNum,
    })
    public court_number: courtNum;

    @ApiProperty({
        required: true,
        type: String,
    })
    public court_price: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public date_of_court: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public description: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public start_time: string;

    @ApiProperty({
        required: true,
        type: String,
    })
    public end_time: string;

    @ApiProperty({
        required: true,
        type: Boolean,
    })
    public available: boolean;
}
