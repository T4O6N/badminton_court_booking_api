import { PartialType } from '@nestjs/mapped-types';
import { StaffDto } from './create-staff.dto';

export class UpdateStaffDto extends PartialType(StaffDto) {}
