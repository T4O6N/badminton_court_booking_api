import { PartialType } from '@nestjs/mapped-types';
import { CourtBookingDTO } from './create-court-booking.dto';

export class UpdateCourtBookingDto extends PartialType(CourtBookingDTO) {}
