// src/qarzdor/qarzdor.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateQarzdorDto } from './dto/create-qarzdor.dto';
import { PrismaService } from 'src/core/prisma.service';
import { TolovQilishDto } from './dto/tolov-qilish.dto';

@Injectable()
export class QarzdorService {
  constructor(private prisma: PrismaService) {}

  // ✅ Barcha qarzdorlarni olish
  async findAll(status?: string) {
    const where = status ? { status } : {};

    const qarzdorlar = await this.prisma.qarzdor.findMany({
      where,
      include: {
        tolovlar: {
          orderBy: { sana: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Statistika hisoblash
    const jami = await this.prisma.qarzdor.aggregate({
      _sum: {
        umumiyQarz: true,
        tolangan: true,
        qoliqQarz: true,
      },
      _count: true,
    });

    return {
      qarzdorlar,
      statistika: {
        jamiQarzdorlar: jami._count,
        jamiQarz: jami._sum.umumiyQarz || 0,
        jamiTolangan: jami._sum.tolangan || 0,
        jamiQoliq: jami._sum.qoliqQarz || 0,
      },
    };
  }

  // ✅ Bitta qarzdorni ID bo'yicha olish
  async findOne(id: number) {
    const qarzdor = await this.prisma.qarzdor.findUnique({
      where: { id },
      include: {
        tolovlar: {
          orderBy: { sana: 'desc' },
        },
      },
    });

    if (!qarzdor) {
      throw new NotFoundException(`${id}-ID li qarzdor topilmadi`);
    }

    return qarzdor;
  }

  // ✅ Qidiruv (ism bo'yicha)
  async search(query: string) {
    return this.prisma.qarzdor.findMany({
      where: {
        kim: {
          contains: query,
        },
      },
      include: {
        tolovlar: {
          orderBy: { sana: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Yangi qarzdor qo'shish
  async create(dto: CreateQarzdorDto) {
    return this.prisma.qarzdor.create({
      data: {
        kim: dto.kim.trim(),
        umumiyQarz: dto.umumiyQarz,
        qoliqQarz: dto.umumiyQarz, // Boshida to'liq qarz = qoliq
        tolangan: 0,
        status: 'QARZDOR',
        izoh: dto.izoh,
      },
    });
  }

  // ✅ To'lov qilish (qisman yoki to'liq)
  async tolovQilish(id: number, dto: TolovQilishDto) {
    const qarzdor = await this.findOne(id);

    if (qarzdor.status === 'TOLANDI') {
      throw new BadRequestException('Bu qarzdor allaqachon to\'liq to\'lagan');
    }

    if (dto.miqdor > qarzdor.qoliqQarz) {
      throw new BadRequestException(
        `To'lov miqdori (${dto.miqdor}) qoliq qarzdan (${qarzdor.qoliqQarz}) ko'p bo'lishi mumkin emas`,
      );
    }

    const yangiTolangan = qarzdor.tolangan + dto.miqdor;
    const yangiQoliq = qarzdor.qoliqQarz - dto.miqdor;
    const yangiStatus = yangiQoliq === 0 ? 'TOLANDI' : 'QARZDOR';

    // Transaction: to'lov va qarzdor yangilash bir vaqtda
    // Transaction: to'lov va qarzdor yangilash bir vaqtda
    const [tolov, yangilangan] = await this.prisma.$transaction([
      // To'lov yozuvi qo'shish
      this.prisma.tolov.create({
        data: {
          miqdor: dto.miqdor,  // miqdorId emas, faqat miqdor
          izoh: dto.izoh,
          qarzdorId: id,
        },
      }),
      // Qarzdor ma'lumotini yangilash
      this.prisma.qarzdor.update({
        where: { id },
        data: {
          tolangan: yangiTolangan,
          qoliqQarz: yangiQoliq,
          status: yangiStatus,
        },
        include: {
          tolovlar: {
            orderBy: { sana: 'desc' },
          },
        },
      }),
    ]);

    return {
      xabar:
        yangiStatus === 'TOLANDI'
          ? '✅ Qarz to\'liq to\'landi!'
          : `💰 To'lov qabul qilindi. Qoliq: ${yangiQoliq.toLocaleString()} so'm`,
      qarzdor: yangilangan,
      tolov,
    };
  }

  // ✅ Qarz miqdorini yangilash (qo'shimcha qarz qo'shish)
  async qarzYangilash(id: number, qoshimchaQarz: number) {
    const qarzdor = await this.findOne(id);

    if (qoshimchaQarz <= 0) {
      throw new BadRequestException('Qo\'shimcha qarz 0 dan katta bo\'lishi kerak');
    }

    return this.prisma.qarzdor.update({
      where: { id },
      data: {
        umumiyQarz: qarzdor.umumiyQarz + qoshimchaQarz,
        qoliqQarz: qarzdor.qoliqQarz + qoshimchaQarz,
        status: 'QARZDOR', // Agar to'langan bo'lsa ham yangi qarz qo'shildi
      },
      include: { tolovlar: true },
    });
  }

  // ✅ Qarzdorni o'chirish
  async remove(id: number) {
    await this.findOne(id); // Mavjudligini tekshirish

    await this.prisma.qarzdor.delete({ where: { id } });

    return { xabar: 'Qarzdor muvaffaqiyatli o\'chirildi' };
  }
}