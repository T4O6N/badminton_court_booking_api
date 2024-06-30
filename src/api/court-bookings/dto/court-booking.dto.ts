import { PaymentStatus } from '@prisma/client';

export class CourtDTO {
    public court_number: string;

    public court_price: number;

    public start_time: string;

    public end_time: string;
}

export class CourtBookingDTO {
    public device_id: string;

    public phone: string;

    public full_name: string;

    public payment_status: PaymentStatus;

    public booked_by: string;

    public total_amount: number;

    public bookingTime: Date;

    public court: CourtDTO[];
}
