import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { AuthGuard } from '@nestjs/passport';  // Keep this import
import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthorizationGuard, AuthService], // Remove AuthGuard from here
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'yourSuperSecretKey',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    }),
  ],
})
export class AuthModule {}