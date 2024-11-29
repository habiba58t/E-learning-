import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { InstructorService } from './instructor.service';
import { Module } from 'src/modules/modules.schema';
@Controller('instructor')
export class InstructorController {
    constructor(private readonly instructorService: InstructorService) {}
    //@Get()
    //async getCoursesForStudent(): Promise<Courses[]> {
     //hanroo7 user ngyb array of courses ,loop put courses in array get course by objectId WHEre is outdated false
    // return this.instructorService.getCoursesForStudent();
  //  }

  @Get()
    async getModulesForStudent(): Promise<Module[]> {
     //hanroo7 user ngyb array of courses ,loop put courses in array get course by objectId WHEre is outdated false
     return this.instructorService.getModulesForStudent();
   }
 


}
