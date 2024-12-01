import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports:[UsersModule, JwtModule.register({
    global:true,
    secret:process.env.JWT_SECRET,
    signOptions:{expiresIn:process.env.JWT_EXPIRES_IN},
  })]
})
export class AuthModule {}
