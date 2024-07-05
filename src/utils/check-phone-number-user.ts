import { BadRequestException } from '@nestjs/common';

export const checkPhoneNumberUser = async (phoneNumber: string) => {
    if (!phoneNumber) {
        throw new BadRequestException(`Phone number should not be empty`);
    }

    const regex = /^\d+$/;
    if (!regex.test(phoneNumber) === false) {
        throw new BadRequestException(`Phone number should be number`);
    }

    if (phoneNumber.length !== 10) {
        throw new BadRequestException(`Phone number should be 10 number`);
    }
};
