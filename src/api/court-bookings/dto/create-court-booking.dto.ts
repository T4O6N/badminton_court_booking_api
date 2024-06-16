import { Court, PaymentStatus } from '@prisma/client';

export class CourtBookingDto {
    public phone: string;
    public first_name: string;
    public payment_Status: PaymentStatus;
    public book_duration: number;
    public booked_by: string;
    public total_amount: number;
    public court: Court[];
}
