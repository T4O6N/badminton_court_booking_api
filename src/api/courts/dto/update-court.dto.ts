import { PartialType } from '@nestjs/mapped-types';
import { CourtDTO } from './create-court.dto';

export class UpdateCourtDto extends PartialType(CourtDTO) {}
