import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { QarzdorService } from './qarzdor.service';
import { CreateQarzdorDto } from './dto/create-qarzdor.dto';
import { TolovQilishDto } from './dto/tolov-qilish.dto';

@ApiTags('qarzdorlar')
@Controller('qarzdorlar')
export class QarzdorController {
  constructor(private readonly qarzdorService: QarzdorService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha qarzdorlar + statistika' })
  @ApiQuery({ name: 'status', required: false, enum: ['QARZDOR', 'TOLANDI'] })
  @ApiResponse({ status: 200, description: 'Qarzdorlar ro\'yxati va statistika' })
  findAll(@Query('status') status?: string) {
    return this.qarzdorService.findAll(status);
  }

  @Get('search')
  @ApiOperation({ summary: 'Ism bo\'yicha qidirish' })
  @ApiQuery({ name: 'q', required: true, example: 'Botir' })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari' })
  search(@Query('q') query: string) {
    return this.qarzdorService.search(query || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta qarzdor (to\'lov tarixi bilan)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Qarzdor ma\'lumotlari' })
  @ApiResponse({ status: 404, description: 'Qarzdor topilmadi' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.qarzdorService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Yangi qarzdor qo\'shish' })
  @ApiResponse({ status: 201, description: 'Qarzdor yaratildi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumot' })
  create(@Body() dto: CreateQarzdorDto) {
    return this.qarzdorService.create(dto);
  }

  @Patch(':id/tolov')
  @ApiOperation({ summary: 'To\'lov qilish (qisman yoki to\'liq)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'To\'lov qabul qilindi' })
  @ApiResponse({ status: 400, description: 'Miqdor qarzdan ko\'p yoki allaqachon to\'langan' })
  tolovQilish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TolovQilishDto,
  ) {
    return this.qarzdorService.tolovQilish(id, dto);
  }

  @Patch(':id/qarz-qosh')
  @ApiOperation({ summary: 'Qo\'shimcha qarz qo\'shish' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Qarz yangilandi' })
  qarzQosh(
    @Param('id', ParseIntPipe) id: number,
    @Body('miqdor') miqdor: number,
  ) {
    return this.qarzdorService.qarzYangilash(id, miqdor);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Qarzdorni o\'chirish' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'O\'chirildi' })
  @ApiResponse({ status: 404, description: 'Topilmadi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.qarzdorService.remove(id);
  }
}