// src/app.module.ts

import { Module } from '@nestjs/common';
import { QarzdorModule } from './qarzdor/qarzdor.module';
import { PrismaModule } from './core/prisma.module';

@Module({
  imports: [
    PrismaModule,
    QarzdorModule,
  ],
})
export class AppModule {}