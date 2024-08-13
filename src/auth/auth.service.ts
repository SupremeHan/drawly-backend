import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma.service';
import { UserDetails } from 'src/utils/types';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUser(details: UserDetails) {
    console.log('Auth service');
    console.log(details);

    const { email, displayName } = details;
    let user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log('User not found, creating...');
      user = await this.prisma.user.create({
        data: { email, displayName },
      });
    }

    return user;
  }

  async findUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      console.log('Could not find the user');
    }

    return user;
  }
}
