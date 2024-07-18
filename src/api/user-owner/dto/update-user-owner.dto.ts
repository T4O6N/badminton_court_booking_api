import { PartialType } from '@nestjs/mapped-types';
import { UserOwnerDTO } from './create-user-owner.dto';

export class UpdateUserOwnerDTO extends PartialType(UserOwnerDTO) {}
