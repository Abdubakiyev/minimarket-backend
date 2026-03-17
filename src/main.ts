
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['https://minimarket-ten.vercel.app/', 'https://minimarket-ten.vercel.app'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('📒 Qarz Daftar API')
    .setDescription('Qarz daftari - barcha qarzdorlar va to\'lovlarni boshqarish')
    .setVersion('1.0')
    .addTag('qarzdorlar', 'Qarzdorlar bilan ishlash')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server: http://localhost:${port}/api`);
  console.log(`📄 Swagger: http://localhost:${port}/docs`);
}

bootstrap();