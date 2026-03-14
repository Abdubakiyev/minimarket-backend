import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect(); // Prisma 7-da istasangiz alohida connect chaqirishingiz mumkin
      this.logger.log('✅ Prisma client ready');
    } catch (error) {
      this.logger.error('❌ Database connection failed', error as any);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Database disconnected successfully');
    } catch (error) {
      this.logger.error('Error disconnecting database', error as any);
    }
  }
}
