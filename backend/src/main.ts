import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


//import * as dotenv from 'dotenv';
import 'reflect-metadata';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  //await app.listen(process.env.PORT ?? 3002);
  
  app.enableCors({
    origin: 'http://localhost:3000', // Specify your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Specify allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Specify allowed headers
    credentials: true, // Enable credentials (cookies, etc.)
  });
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
