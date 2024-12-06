import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 // await app.listen(process.env.PORT ?? 3002);
  app.use(cookieParser())
  dotenv.config();
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
