// src/app.module.ts

import { Module } from '@nestjs/common';
import { QarzdorModule } from './qarzdor/qarzdor.module';
import { PrismaModule } from './core/prisma.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    QarzdorModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}