import { BadRequestException } from '@nestjs/common';

export const mailFormat = async (email: string) => {
  const regex = /^([a-zA-Z0-9_+-.]+)@gmail.com$/;
  if (regex.test(email) === false) {
    throw new BadRequestException('Invalid email address');
  }

  return regex.test(email);
};
