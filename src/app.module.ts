// src/app.module.ts

import { Module } from '@nestjs/common';
import { QarzdorModule } from './qarzdor/qarzdor.module';
import { PrismaModule } from './core/prisma.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule,
    QarzdorModule,
  ],
  controllers: [AppController],
})
export class AppModule {}