import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { StudentService } from './student.service';
import { Users, UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

  //GET: get courses for user  
  //  @Get()
    //async getCoursesForStudent(): Promise<Courses[]> {
     //hanroo7 user ngyb array of courses ,loop put courses in array get course by objectId WHEre is outdated false
   //  return this.studentService.getCoursesForStudent();
    //}

   //GET STUDENT SCORE
   @Get() 
   async getStudentScore(@Param('username') username: string, @Param('objectId')objectId:mongoose.Types.ObjectId): Promise<number | null>{
    return this.studentService.getStudentScore(username,objectId);
   
  }
 //GET STUDENT LEVEL
   @Get() 
   async getStudentLevel(@Param('username') username: string, @Param('objectId')objectId:mongoose.Types.ObjectId ): Promise<string | null> {
    return this.studentService.getStudentLevel(username,objectId);
   }

   @Put() 
   async setStudentScore(@Param('username') username: string, @Param('objectId')objectId:mongoose.Types.ObjectId, @Param('newScore')newScore:number): Promise<void>{
     this.studentService.setStudentScore(username,objectId,newScore);
   
  }
 //GET STUDENT LEVEL
   @Put() 
   async setStudentLevel(@Param('username') username: string, @Param('objectId')objectId:mongoose.Types.ObjectId, @Param('updatedScore') updatedScore:number ): Promise<void> {
     this.studentService.setStudentLevel(username,objectId,updatedScore);
   }

//GET ALL NOTES OBJECT ID FOR A SPECIFIC MODULE
@Get()
   async getAllNotesForModule(@Param('moduleId') moduleId: mongoose.Types.ObjectId,@Param('username')username:string): Promise<mongoose.Types.ObjectId[] | null> {
    return this.studentService.getAllNotesForModule(moduleId,username);
   }

}
