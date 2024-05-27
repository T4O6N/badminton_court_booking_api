import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Badminton Court Booking API')
    .setDescription('Badminton Court Booking API description')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'headers',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .addGlobalParameters({
      name: 'Accept-Language',
      in: 'header',
      required: true,
      example: 'en',
      description: 'The preferred language of the client: en, lo',
    })
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  const customSiteTitle: SwaggerCustomOptions = {
    customSiteTitle: 'Badminton Court Booking API Docs',
    swaggerOptions: {
      docExpansion: 'list',
      // swagger filter options
      filter: true,
      showRequestDuration: true,
    },
  };
  SwaggerModule.setup('api', app, document, customSiteTitle);
}
