import { PaymentStatus } from "@prisma/client";

export class CourtBookingPaymentDto {
    courtBookingId: string;
    total_amount: number;
    payment_status: PaymentStatus;
}
