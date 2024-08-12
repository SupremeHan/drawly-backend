import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/guards';

@Controller('auth')
export class AuthController {
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  handleLogin() {
    return { msg: 'google auth' };
  }

  // api/google/redirect
  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  handleRedirect() {
    return { msg: 'OK' };
  }
}
