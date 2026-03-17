import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  @ApiOperation({
    summary: 'Kodni tekshirish',
    description: '6 xonali kirish kodini tekshiradi',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'string',
          example: '123456',
          description: '6 xonali raqamli kod',
          minLength: 6,
          maxLength: 6,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Kod to\'g\'ri',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Kod noto\'g\'ri yoki faol emas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Kod noto\'g\'ri yoki faol emas' },
      },
    },
  })
  verifyCode(@Body('code') code: string) {
    return this.authService.verifyCode(code);
  }

  @Post('set-code')
  @ApiOperation({
    summary: 'Yangi kod o\'rnatish',
    description: 'Yangi 6 xonali kirish kodi saqlaydi. Avvalgi kod o\'chiriladi.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['code'],
      properties: {
        code: {
          type: 'string',
          example: '654321',
          description: 'Yangi 6 xonali raqamli kod',
          minLength: 6,
          maxLength: 6,
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Kod muvaffaqiyatli saqlandi',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Kod muvaffaqiyatli saqlandi' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Noto\'g\'ri so\'rov',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Kod kiritilmadi' },
      },
    },
  })
  setCode(@Body('code') code: string) {
    return this.authService.setCode(code);
  }
}