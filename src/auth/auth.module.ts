import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './utils/google.strategy';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/db/prisma.service';
import { SessionSerializer } from './utils/serializer';

@Module({
  controllers: [AuthController],
  providers: [
    GoogleStrategy,
    PrismaService,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
