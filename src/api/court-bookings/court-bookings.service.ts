import { BadRequestException, Injectable } from '@nestjs/common';
import { CourtBookingDto } from './dto/create-court-booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court-booking.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';

@Injectable()
export class CourtBookingsService {
    constructor(private readonly prisma: PrismaService) {}

    // NOTE - this is booking court function
    async createCourtBooking(courtBookingData: CourtBookingDto): Promise<object> {
        const newCourtBooking = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
            },
            include: {
                court: true,
            },
        });

        return newCourtBooking;
    }

    // NOTE - this is find all booking court function
    async findAllCourtBooking(skip: number, take: number): Promise<object> {
        const page = parseInt(String(skip));
        const limit = parseInt(String(take));

        const findAllCourtBooking = await this.prisma.courtBooking.findMany({
            skip: (page - 1) * limit,
            take: limit,
            include: {
                court: true,
            },
        });

        return findAllCourtBooking;
    }

    // NOTE - this is find one booking court function
    async findOneCourtBooking(courtBookingId: string): Promise<object> {
        const findOneCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        return findOneCourtBooking;
    }

    // NOTE - this is update booking court function
    async updateCourtBooking(courtBookingId: string, courtBookingData: UpdateCourtBookingDto) {
        const findCourtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found');
        }

        const updateCourtBooking = await this.prisma.courtBooking.update({
            where: {
                id: courtBookingId,
            },
            data: {
                ...courtBookingData,
            },
        });

        return updateCourtBooking;
    }

    // NOTE - this is delete booking court function
    async deleteCourtBooking(courtBookingId: string) {
        const findCourtBooking = await this.prisma.courtBooking.findUnique({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found');
        }

        const deleteCourtBooking = await this.prisma.courtBooking.delete({
            where: {
                id: courtBookingId,
            },
        });

        return deleteCourtBooking;
    }
}
