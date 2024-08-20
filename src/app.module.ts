import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ProjectModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
