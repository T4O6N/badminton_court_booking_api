import { PartialType } from '@nestjs/mapped-types';
import { CourtBookingDto } from './create-court-booking.dto';

export class UpdateCourtBookingDto extends PartialType(CourtBookingDto) {}
