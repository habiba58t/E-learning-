import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty() // Name is required
  @IsString()
  name: string;

  @IsNotEmpty() // Username is required
  @IsString()
  username: string;

  @IsNotEmpty() // Email is required and must be valid
  @IsEmail()
  email: string;

  @IsNotEmpty() // Password is required and must have at least 8 characters
  @MinLength(8)
  password: string;

  @IsNotEmpty() // Role is required and must match one of the allowed values
  @IsEnum(['student', 'instructor', 'admin'])
  role: string;
  
  passwordHash: string;
  }