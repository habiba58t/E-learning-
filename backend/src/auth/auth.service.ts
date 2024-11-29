import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto';
import { createDto } from 'src/users/dto/createuser.dto'; // Adjust import based on your project structure
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { SignInDto } from './dto/signInDto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(user: RegisterDto): Promise<string> {
    const existingUser = await this.usersService.findOneByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create a new user object for saving
    const newUser: createDto = {
      ...user,
      passwordHash: hashedPassword, // Correct field name
    };

    // Save the new user to the database
    await this.usersService.create(newUser);

    return 'Registered successfully';
  }

  async login(signInDto:SignInDto){
   
    
    const user = await this.usersService.findOneByUsername(signInDto.username);
  
    if (!user) {
      console.error(`User not found for username: ${signInDto.username}`); // Log failure
      throw new NotFoundException('User not found');
    }
  
    // Compare password hash
    const isPasswordValid = await bcrypt.compare(signInDto.password, user.passwordHash);
    if (!isPasswordValid) {
      console.error(`Invalid password for user: ${signInDto.username}`); // Log failure
      throw new UnauthorizedException('Invalid credentials');
    }
  
    console.log(`User authenticated: ${signInDto.username}, generating token...`); // Log success
    // Generate JWT token
    const payload = {
     username: user.username,
      role: user.role,
    };
  
    const access_token = await this.jwtService.signAsync(payload);
  
    return {
      access_token,
      payload,
    };
  }
  
}
