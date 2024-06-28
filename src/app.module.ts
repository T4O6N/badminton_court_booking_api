import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma/prisma.module';
import { WinstonLoggerService } from './config/loggers/logger.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CourtBookingsModule } from './api/court-bookings/court-bookings.module';
import { CourtsModule } from './api/courts/courts.module';
import { CourtBookingHistoryModule } from './api/court-booking-history/court-booking-history.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        CourtsModule,
        CourtBookingsModule,
        CourtBookingHistoryModule,
    ],
    controllers: [],
    providers: [WinstonLoggerService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
