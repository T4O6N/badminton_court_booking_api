import { PaymentStatus } from "@prisma/client";

export class CourtDTO {
    public court_number: string;

    public court_price: number;

    public start_time: string;

    public end_time: string;
}

export class CourtBookingDTO {
    public phone: string;

    public full_name: string;

    public payment_Status: PaymentStatus;

    public expiredTime: Date;

    public booked_by: string;

    public total_amount: number;

    public bookingTime: Date;

    public court: CourtDTO[];
}