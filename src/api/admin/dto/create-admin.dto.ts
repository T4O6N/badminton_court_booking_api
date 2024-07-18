import { ApiProperty } from '@nestjs/swagger';

export class AdminDTO {
    @ApiProperty({
        type: String,
        description: 'username of admin',
        example: 'admin',
    })
    username: string;

    @ApiProperty({
        type: String,
        description: 'phone of admin',
        example: '2055736369',
    })
    phone: string;

    @ApiProperty({
        type: String,
        description: 'password of admin',
        example: '123456',
    })
    password: string;
}
