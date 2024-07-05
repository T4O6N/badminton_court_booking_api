import { PartialType } from '@nestjs/mapped-types';
import { CourtBookingDTO } from './court-booking.dto';

export class UpdateCourtBookingDto extends PartialType(CourtBookingDTO) {}
