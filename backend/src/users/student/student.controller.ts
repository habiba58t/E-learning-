import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { StudentService } from './student.service';
import { UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

  //GET: get courses for user  
  //  @Get()
    //async getCoursesForStudent(): Promise<Courses[]> {
     //hanroo7 user ngyb array of courses ,loop put courses in array get course by objectId WHEre is outdated false
   //  return this.studentService.getCoursesForStudent();
    //}

    // Enroll student in a specific course
  @Post(':username/enroll/:courseId')
  async enrollStudentInCourse(
    @Param('username') username: string,       // Get student username from URL
    @Param('courseId') courseId: string,       // Get courseId from URL
  ) {
    return this.studentService.enrollStudentInCourse(username, courseId);
  }

  //Create student for register


  //Update student profile
  @Put(':username')
  async updateProfile(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto, // The data to update the student profile
  ) {
    const updatedStudent = await this.studentService.updateProfile(username, updateUserDto);
    return {
      message: 'Student profile updated successfully.',
      student: updatedStudent,
    };
  }
 //Create new student for register 
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true })) // Automatically validate DTO
  async registerStudent(@Body() createStudentDto: CreateUserDto) {
    return this.studentService.createStudent(createStudentDto);
  }

 //Delete student, their progress,responses and notes 
  // @Delete(':username')
  // async deleteStudent(@Param('username') username: string) {
  //   // Deleting the student and associated data
  //   await this.studentService.deleteStudentAndRelatedData(username);
  //   return { message: 'Student and related data deleted successfully.' };
  // }
}



