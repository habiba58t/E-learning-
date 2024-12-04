import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto'; // Adjust import based on your project structure
import * as bcrypt from 'bcrypt';
import mongoose, { Model, Types } from 'mongoose';
import { SignInDto } from './dto/signInDto';
import { userDocument, Users } from 'src/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from 'src/log/log.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private  userModel: Model<Users>,
    @InjectModel(Log.name) private  logModel: mongoose.Model<Log>,

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
    const newUser = {
      ...user,
     // password_hash: hashedPassword, // Correct field name
    };

    // Save the new user to the database
    await this.usersService.create(newUser, hashedPassword);

    return 'Registered successfully';
  }

  async login(signInDto: SignInDto) {
    const { username, password } = signInDto;

    // Find user by username
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
        throw new NotFoundException('User not found');
    }

    // Check if the user has exceeded 5 failed attempts within the last 15 minutes
    const failedAttempts = await this.logModel.countDocuments({
        username: user._id,
        success: false,
        timestamp: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // 15 minutes window
    });

    if (failedAttempts >= 5) {
        throw new UnauthorizedException('Too many failed login attempts. Please try again later.');
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        // Log the failed login attempt
        await this.logModel.create({
            username: user._id,
            action: 'Login Failed',
            success: false,
            timestamp: new Date(),
        });
        throw new UnauthorizedException('Invalid credentials');
    }

    // Log successful login
    await this.logModel.create({
        username: user._id,
        action: 'Login Successful',
        success: true,
        timestamp: new Date(),
    });

    // JWT token generation
    const payload = { username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
        access_token: token,
        payload,
    };
}
  
}
