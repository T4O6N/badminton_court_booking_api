import { BadRequestException, Injectable } from '@nestjs/common';
import { CourtBookingDto } from './dto/create-court-booking.dto';
import { UpdateCourtBookingDto } from './dto/update-court-booking.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { courtBooking } from '@prisma/client';

@Injectable()
export class CourtBookingsService {
    constructor(private readonly prisma: PrismaService) {}

    // NOTE - this is find all booking court function
    async findAllCourtBooking(): Promise<courtBooking[]> {
        const findAllCourtBooking = await this.prisma.courtBooking.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return findAllCourtBooking;
    }

    // NOTE - this is find one booking court function
    async findCourtBookingById(courtBookingId: string): Promise<courtBooking> {
        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found in database');
        }

        const findOneCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
            include: {
                court: {
                    select: {
                        court_number: true,
                        court_price: true,
                        date_of_court: true,
                        description: true,
                        start_time: true,
                        end_time: true,
                        available: true,
                    },
                },
            },
        });

        return findOneCourtBooking;
    }

    // NOTE - this is booking court function
    async createCourtBooking(courtBookingData: CourtBookingDto): Promise<courtBooking> {
        const newCourtBookingData = await this.prisma.courtBooking.create({
            data: {
                ...courtBookingData,
                booked_by: courtBookingData.first_name,
                court: {
                    create: courtBookingData.court.map((courtDto) => ({
                        court_number: courtDto.court_number,
                        court_price: courtDto.court_price,
                        date_of_court: courtDto.date_of_court,
                        description: courtDto.description,
                        start_time: courtDto.start_time,
                        end_time: courtDto.end_time,
                        available: courtDto.available,
                    })),
                },
            },
            include: {
                court: {
                    select: {
                        court_number: true,
                        court_price: true,
                        date_of_court: true,
                        description: true,
                        start_time: true,
                        end_time: true,
                        available: true,
                    },
                },
            },
        });

        return newCourtBookingData;
    }

    // NOTE - this is update booking court function
    async updateCourtBooking(courtBookingId: string, courtBookingData: UpdateCourtBookingDto): Promise<courtBooking> {
        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found in database');
        }

        const updateCourtBooking = await this.prisma.courtBooking.update({
            where: {
                id: courtBookingId,
            },
            data: {
                ...courtBookingData,
                court: {
                    create: courtBookingData.court
                        ? courtBookingData.court.map((courtDto) => ({
                              court_number: courtDto.court_number,
                              court_price: courtDto.court_price,
                              date_of_court: courtDto.date_of_court,
                              description: courtDto.description,
                              start_time: courtDto.start_time,
                              end_time: courtDto.end_time,
                              available: courtDto.available,
                          }))
                        : [],
                },
            },
            include: {
                court: {
                    select: {
                        court_number: true,
                        court_price: true,
                        date_of_court: true,
                        description: true,
                        start_time: true,
                        end_time: true,
                        available: true,
                    },
                },
            },
        });

        return updateCourtBooking;
    }

    // NOTE - this is delete booking court function
    async deleteCourtBooking(courtBookingId: string): Promise<courtBooking> {
        const findCourtBooking = await this.prisma.courtBooking.findFirst({
            where: {
                id: courtBookingId,
            },
        });

        if (!findCourtBooking) {
            throw new BadRequestException('Court booking not found in database');
        }

        const deleteCourtBooking = await this.prisma.courtBooking.delete({
            where: {
                id: courtBookingId,
            },
        });

        return deleteCourtBooking;
    }
}
