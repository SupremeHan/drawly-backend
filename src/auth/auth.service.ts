import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

import { PrismaService } from 'src/db/prisma.service';
import { GoogleUser } from 'src/utils/types';
import {
  COOKIE_NAMES,
  expiresTimeTokenMilliseconds,
} from './constants/auth.constants';
import { CookieOptions, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async signInWithGoogle(
    user: GoogleUser,
    res: Response,
  ): Promise<{ encodedUser: string }> {
    if (!user) throw new BadRequestException('Unauthenticated');

    const existingUser = await this.findUserByEmail(user.email);

    if (!existingUser) return this.registerGoogleUser(res, user);

    const encodedUser = this.encodeUserDataAsJwt(existingUser);

    this.setJwtTokenToCookies(res, existingUser);

    return {
      encodedUser,
    };
  }

  private async findUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) return null;
    return user;
  }

  private async registerGoogleUser(res: Response, user: GoogleUser) {
    try {
      const fullName =
        !user.firstName && !user.lastName
          ? user.email
          : `${user.lastName || ''} ${user.firstName || ''}`.trim();

      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          fullName,
          picture: user.picture,
        },
      });

      const encodedUser = this.encodeUserDataAsJwt(newUser);

      this.setJwtTokenToCookies(res, newUser);

      return {
        encodedUser,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private encodeUserDataAsJwt(user: User) {
    // even though we did not define a password on our user's schema
    // we extract it from the user in case we will have it on the future
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return this.jwtService.sign(userData);
  }

  setJwtTokenToCookies(res: Response, user: User) {
    const expirationDateInMilliseconds =
      new Date().getTime() + expiresTimeTokenMilliseconds;
    const cookieOptions: CookieOptions = {
      httpOnly: true, // this ensures that the cookie cannot be accessed through JavaScript!
      expires: new Date(expirationDateInMilliseconds),
    };

    res.cookie(
      COOKIE_NAMES.JWT,
      this.jwtService.sign({
        id: user.id,
        sub: {
          email: user.email,
        },
      }),
      cookieOptions,
    );
  }
}
