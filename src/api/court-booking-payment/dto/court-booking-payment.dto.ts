import { PaymentStatus } from '@prisma/client';

export class CourtBookingPaymentDto {
    court_booking_id: string;
    court_available_id: string;
    device_id: string;
    // admin_id: string;
    payment_status: PaymentStatus;
    payment_date: Date;
    payment_time: Date;
}
