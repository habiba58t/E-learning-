import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/registerDto';
import { CreateUserDto } from 'src/users/dto/CreateUser.dto'; // Adjust import based on your project structure
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { SignInDto } from './dto/signInDto';
import { userDocument, Users } from 'src/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LogsService } from 'src/users/logs/logs.service';
import { Role } from './decorators/role.decorator';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<userDocument>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private logsService: LogsService
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

    // Log username for debugging
    console.log(`Attempting login for username: ${username}`);

    // Find user by username
    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      console.error(`User not found for username: ${username}`);

      // Log failed login attempt for non-existent user
      await this.logsService.recordLog(null, 'Login Failed', false, 'Unknown' as Role); // Unknown role
      throw new NotFoundException('User not found');
    }
    if (user.failedAttempts >= 5) {
      console.error(`Account is locked due to multiple failed login attempts: ${username}`);
  

    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.error(`Invalid password for user: ${username}`);

      // Log failed login attempt for incorrect password
      await this.logsService.recordLog(user._id, 'Login Failed', false, user.role as Role);
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(`User authenticated: ${username}, generating token...`);

    // JWT payload
    const payload = { username: user.username, role: user.role };
    console.log("Payload created:", payload);

    // Debugging JWT configuration
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    console.log('JWT Configuration:', { secret, expiresIn });

    // Generate token
    const token = await this.jwtService.signAsync(payload, { secret, expiresIn });
    console.log('Generated token:', token);

    // Log successful login attempt
    await this.logsService.recordLog(user._id, 'Login Successful', true, user.role as Role);

    return {
      access_token: token,
      payload,
    };
  }
  
  
}
}