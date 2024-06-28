import { PartialType } from '@nestjs/mapped-types';
import { CourtBookingHistoryDTO } from './court-booking-history.dto';

export class UpdateCourtBookingHistoryDto extends PartialType(CourtBookingHistoryDTO) {}
