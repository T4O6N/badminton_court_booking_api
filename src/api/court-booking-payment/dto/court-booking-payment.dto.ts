import { PaymentStatus } from '@prisma/client';

export class CourtBookingPaymentDto {
    courtBookingId: string;
    device_id: string;
    payment_status: PaymentStatus;
}
