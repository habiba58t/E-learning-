import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { createDto } from './dto/createuser.dto';
import { UserDocument, Users } from './users.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('by-username/:username')
  @UseGuards(AuthGuard, AuthorizationGuard)
  async findOne(@Param('username') username: string): Promise<UserDocument | null> {
    return this.usersService.findOneByUsername(username);
  }

  @Get('by-email')
  @UseGuards(AuthGuard, AuthorizationGuard)
  async findOneEmail(@Query('email') email: string): Promise<UserDocument | null> {
    return this.usersService.findOneByEmail(email);
  }

  @Post()
  async createStudent(@Body() userData: createDto): Promise<UserDocument> {
    try {
      return await this.usersService.create(userData);
    } catch (error) {
      throw error;
    }
  }

  @Get('/')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('admin') // Only admin can view all users
  async findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }
}
