import { PartialType } from '@nestjs/mapped-types';
import { CourtSessionDTO } from './create-court-session.dto';

export class UpdateCourtSessionDto extends PartialType(CourtSessionDTO) {}
