import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../core/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async verifyCode(code: string): Promise<{ success: boolean }> {
    const accessCode = await this.prisma.accessCode.findUnique({
      where: { code },
    });

    if (!accessCode || !accessCode.isActive) {
      throw new UnauthorizedException('Kod noto\'g\'ri yoki faol emas');
    }

    return { success: true };
  }

  async setCode(code: string): Promise<{ message: string }> {
    // Avvalgi barcha kodlarni o'chirish
    await this.prisma.accessCode.deleteMany();
    
    // Yangi kod saqlash
    await this.prisma.accessCode.create({
      data: { code },
    });

    return { message: 'Kod muvaffaqiyatli saqlandi' };
  }
}