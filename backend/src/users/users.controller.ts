import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import { Courses } from 'src/courses/courses.schema';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
     //GET: get array of courses for a speicifc user
    @Get(':username')
  async findCoursesArray(@Param('username') username: string): Promise<Courses[]> {
    return this.usersService.findCoursesArray(username);
  }


}
