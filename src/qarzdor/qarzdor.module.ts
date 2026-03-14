// src/qarzdor/qarzdor.module.ts

import { Module } from '@nestjs/common';
import { QarzdorController } from './qarzdor.controller';
import { QarzdorService } from './qarzdor.service';

@Module({
  controllers: [QarzdorController],
  providers: [QarzdorService],
})
export class QarzdorModule {}