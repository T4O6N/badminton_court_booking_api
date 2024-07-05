import { PartialType } from '@nestjs/mapped-types';
import { CourtTimeDTO } from './create-court-time.dto';

export class UpdateCourtTimeDto extends PartialType(CourtTimeDTO) {}
