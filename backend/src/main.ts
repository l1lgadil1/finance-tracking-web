import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next.js dev server
      'http://localhost:3001', // Alternative dev port
      'http://localhost:8080', // Potential Docker/container port
      // Add production domains when deploying
      // 'https://yourdomain.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ZodValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('AqshaTracker API')
    .setDescription(
      'API Documentation for the AqshaTracker finance application',
    )
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT auth in Swagger UI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
