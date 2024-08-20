import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './utils/google-oauth.guard';
import { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() {}

  // api/google/redirect
  @UseGuards(GoogleAuthGuard)
  @Get('google-auth-redirect')
  async googleAuthRedirect(@Req() req, @Res() res: ExpressResponse) {
    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user,
      res,
    );
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}?jwtUser=${encodedUser}`,
    );
  }
}
