import { ApiProperty } from '@nestjs/swagger';

export class UserOwnerDTO {
    @ApiProperty({
        type: String,
        description: 'username of onwner',
        example: 'admin',
    })
    username: string;

    @ApiProperty({
        type: String,
        description: 'phone of onwner',
        example: '2055736369',
    })
    phone: string;

    @ApiProperty({
        type: String,
        description: 'password of onwner',
        example: '123456',
    })
    password: string;
}
