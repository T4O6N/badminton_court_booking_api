import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import { PrismaModule } from './config/prisma/prisma.module';
import { WinstonLoggerService } from './config/loggers/logger.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { LanguageModule } from './config/lang/language.module';
import { CourtBookingsModule } from './api/court-bookings/court-bookings.module';
import { CourtsModule } from './api/courts/courts.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, './i18n'),
                watch: true,
                includeSubfolders: true,
            },
            resolvers: [
                {
                    use: QueryResolver,
                    options: ['lang'],
                },
                AcceptLanguageResolver,
                new HeaderResolver(['x-lang']),
            ],
        }),
        PrismaModule,
        LanguageModule,
        CourtBookingsModule,
        CourtsModule,
    ],
    controllers: [],
    providers: [WinstonLoggerService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
