import { PaymentStatus } from '@prisma/client';

export class CourtBookingPaymentDto {
    court_booking_id: string;
    device_id: string;
    payment_status: PaymentStatus;
    payment_date: Date;
}
