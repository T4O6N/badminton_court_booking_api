import { PartialType } from '@nestjs/mapped-types';
import { CourtTimeSlotDTO } from './create-court-time.dto';

export class UpdateCourtTimeDto extends PartialType(CourtTimeSlotDTO) {}
