import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Users, UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { InstructorService } from './instructor.service';
import { Module, moduleDocument } from 'src/modules/modules.schema';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)

@Controller('instructor')
export class InstructorController {
    constructor(private readonly instructorService: InstructorService) {}

  @Public()
   // //Get AverageRating  of Instructor
  @Get('/rating/:username')
  async getAvgRating(@Param('username') username: string): Promise<number> {
   return await this.instructorService.getAvgRating(username);
  }

//SET TOTALRATING TOTALSTUDENTS AVERAGE RATING
@UseGuards(AuthorizationGuard)
@Roles(Role.User)
@Put(':username/:score')
async setRating(@Param('username') username: string, @Param('score')score:number): Promise<void> {
 await this.instructorService.setRating(username,score);
}

@UseGuards(AuthorizationGuard)
@Roles(Role.Instructor, Role.Admin)
@Delete(':username')
async deleteInstructor(@Param('username') username: string): Promise<{ message: string }> {
  return await this.instructorService.deleteInstructor(username);
}


 


}
