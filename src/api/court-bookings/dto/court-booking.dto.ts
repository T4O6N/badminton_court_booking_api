import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@prisma/client';
import { CourtDTO } from 'src/api/courts/dto/create-court.dto';

export class CourtBookingDTO {
    @ApiProperty({
        type: String,
        description: 'device id',
        example: 'UP1A.231005.007',
    })
    device_id: string;

    @ApiProperty({
        type: String,
        description: 'phone number',
        example: '2055736369',
    })
    phone: string;

    @ApiProperty({
        type: String,
        description: 'full name',
        example: 'John Doe',
    })
    full_name: string;

    @ApiProperty({
        type: String,
        description: 'court number',
        example: 'A1',
    })
    court_number: string;

    @ApiProperty({
        enum: PaymentStatus,
        description: 'payment status',
        example: 'paided',
    })
    payment_status: PaymentStatus;

    @ApiProperty({
        type: Number,
        description: 'total amount',
        example: 120000,
    })
    total_amount: number;

    @ApiProperty({
        type: String,
        description: 'booked by',
    })
    booked_by: string;

    @ApiProperty({
        type: [CourtDTO],
        description: 'court',
    })
    court: CourtDTO[];
}
