import { PartialType } from '@nestjs/mapped-types';
import { CourtDto } from './create-court.dto';

export class UpdateCourtDto extends PartialType(CourtDto) {}
