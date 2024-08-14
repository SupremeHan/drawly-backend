import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');

  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:5173', // React Server
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT);
}
bootstrap();
