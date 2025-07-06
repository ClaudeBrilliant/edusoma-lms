import { NestFactory } from '@nestjs/core';
<<<<<<< HEAD
=======
import { ValidationPipe } from '@nestjs/common';
>>>>>>> 957d6066cc4a8351a38bf3e5a4f015457e88d1e8
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
  await app.listen(process.env.PORT ?? 3000);
=======

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/v1/docs`);
>>>>>>> 957d6066cc4a8351a38bf3e5a4f015457e88d1e8
}
bootstrap();
