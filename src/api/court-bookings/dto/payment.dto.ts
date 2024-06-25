import { PaymentStatus } from '@prisma/client';

export class PaymentDTO {
    public bookingId: string;

    public total_amount: number;

    public payment_Status: PaymentStatus;
}
