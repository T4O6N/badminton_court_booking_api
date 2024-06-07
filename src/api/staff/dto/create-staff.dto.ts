import { ApiProperty } from '@nestjs/swagger';

export class StaffDto {
    @ApiProperty({
        type: String,
    })
    public phone: string;

    @ApiProperty({
        type: String,
    })
    public full_name: string;

    @ApiProperty({
        type: String,
    })
    public last_name: string;

    @ApiProperty({
        type: String,
    })
    public email: string;

    @ApiProperty({
        type: String,
    })
    public username: string;

    @ApiProperty({
        type: String,
    })
    public password: string;
}
