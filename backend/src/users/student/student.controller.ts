import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { StudentService } from './student.service';
import { UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

  //GET: get courses for user  
   // @Get()
   // async getCoursesForStudent(): Promise<Courses[]> {
     //hanroo7 user ngyb array of courses ,loop put courses in array get course by objectId WHEre is outdated false
   // }


}
