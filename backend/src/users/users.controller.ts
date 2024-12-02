import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { UsersService } from './users.service';
import * as mongoose from 'mongoose';
import { Courses } from 'src/courses/courses.schema';
import { Users, UsersSchema } from './users.schema';
import { userDocument } from './users.schema';
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
     //GET: get array of courses for a speicifc user
  //   @Get(':username')
  // async findCoursesArray(@Param('username') username: string): Promise<Courses[]> {
  //   return this.usersService.findCoursesArray(username);
  // }

  //GET USER BY username
  @Get(':username')
  async findUserByUsername(@Param('username') username: string): Promise<userDocument> {
    return this.usersService.findUserByUsername(username);
  }
 //GETT ALL USERS ENROLLED IN A COURSE
//  @Get() 
//    async getEnrolledStudents(@Param('objectId')objectId:mongoose.Types.ObjectId): Promise<Users[]>{
//      return this.usersService.getEnrolledStudents(objectId);
//    }
}
