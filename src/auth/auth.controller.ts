import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('verify')
  verifyCode(@Body('code') code: string) {
    return this.authService.verifyCode(code);
  }

  @Post('set-code')
  setCode(@Body('code') code: string) {
    return this.authService.setCode(code);
  }
}