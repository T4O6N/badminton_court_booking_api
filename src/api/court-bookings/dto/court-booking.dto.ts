import { PaymentStatus } from '@prisma/client';

export class CourtDTO {
    public date: string;

    public duration_time: string[];
}

export class CourtBookingDTO {
    public device_id: string;

    public phone: string;

    public full_name: string;

    public court_number: string;

    public payment_status: PaymentStatus;

    public total_amount: number;

    public booked_by: string;

    public bookingTime: Date;

    public court: CourtDTO[];
}
