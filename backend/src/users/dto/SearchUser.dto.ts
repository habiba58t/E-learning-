import { IsOptional, IsEnum } from 'class-validator';

export class SearchUserDto {
  @IsOptional()
  @IsEnum(['student', 'instructor'])
  role?: string;  // Role filter can either be "student" or "instructor"

  @IsOptional()
  name?: string;  // Optional name filter for search
}