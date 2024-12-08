import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';

dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If no token is provided, throw Unauthorized exception
    if (!token) {
      throw new UnauthorizedException('Please login');
    }

    try {
      // Verify the token using JWT service
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload; // Attach user information to request object
    } catch {
      // If verification fails, throw Unauthorized exception
      throw new UnauthorizedException('Invalid token');
    }
    return true; // Proceed to the next step if token is valid
  }

  // Extract token from either cookies or Authorization header
  extractTokenFromHeader(request: Request): string | undefined {
    console.log(request.cookies)
    
    const token = request.cookies?.user_data.access_token || request.headers['authorization']?.split(' ')[1];
    return token;
  }
}