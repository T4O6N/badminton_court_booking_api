import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './config/prisma/prisma.module';
import { WinstonLoggerService } from './config/loggers/logger.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CourtBookingsModule } from './api/court-bookings/court-bookings.module';
import { CourtsModule } from './api/courts/courts.module';
import { CourtBookingPaymentModule } from './api/court-booking-payment/court-booking-payment.module';
import { CourtTimeModule } from './api/court-time/court-time.module';
import { PromotionModule } from './api/promotion/promotion.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { UserOwnerModule } from './api/user-owner/user-owner.module';
import { AdminModule } from './api/admin/admin.module';
import { CourtSessionModule } from './api/court-session/court-session.module';
// import { AuthModule } from './api/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        CourtsModule,
        CourtTimeModule,
        CourtSessionModule,
        CourtBookingsModule,
        CourtBookingPaymentModule,
        PromotionModule,
        DashboardModule,
        UserOwnerModule,
        AdminModule,
    ],
    providers: [WinstonLoggerService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
