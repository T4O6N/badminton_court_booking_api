import { PartialType } from '@nestjs/mapped-types';
import { AdminDTO } from './create-admin.dto';

export class UpdateAdminDTO extends PartialType(AdminDTO) {}
