import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards,Req, HttpException, HttpStatus } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { StudentService } from './student.service';
import { userDocument, UsersSchema } from '../users.schema';
import { Courses } from 'src/courses/courses.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { CreateUserDto } from '../dto/createuser.dto';
import { UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { Public } from 'src/auth/decorators/public.decorator';


@Controller('student')

@UseGuards(AuthGuard)
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    // Enroll student in a specific course
  @UseGuards(AuthorizationGuard)
@Roles(Role.User)
  @Put('/enroll/:courseId')
  async enrollStudentInCourse(@Req() {user},@Param('courseId') courseId: string):Promise<userDocument> {
    return this.studentService.enrollStudentInCourse(user, courseId);
  }


   //GETT IF A USER IS ENROLLED IN A COURSE
 @UseGuards(AuthorizationGuard)
 @Roles(Role.Admin, Role.Instructor, Role.User)
 @Get('/isenrolled/:objectId') 
 async getisEnrolled(@Req() req, @Param('objectId') objectId: string): Promise<string> {
   const username = req.user?.username;  // Get the username from the request
   if (!username) {
     throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
   }
   return this.studentService.getisEnrolled(username, objectId);
 }
 

  // GET STUDENT SCORE
  @UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
  @Get(':username/score/:objectId')
  async getStudentScore(@Param('username') username: string,@Param('objectId') objectId: string,): Promise<number | null> {
    return await this.studentService.getStudentScore(username, new mongoose.Types.ObjectId(objectId));
  }

  // GET STUDENT LEVEL
  @UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
  @Get(':username/level/:objectId')
  async getStudentLevel(@Param('username') username: string,@Param('objectId') objectId: string,): Promise<string | null> {
    return await this.studentService.getStudentLevel(username,new mongoose.Types.ObjectId(objectId));
  }

  // GET ALL NOTES OBJECT IDS FOR A SPECIFIC MODULE
@UseGuards(AuthorizationGuard)
@Roles(Role.User)
  @Get(':username/notes/:moduleId')
  async getAllNotesForModule(@Param('username') username: string,@Param('moduleId') moduleId: string,): Promise<mongoose.Types.ObjectId[] | null> {
    return await this.studentService.getAllNotesForModule(new mongoose.Types.ObjectId(moduleId), username);
  }

 //Delete student, their progress,responses and notes 
@UseGuards(AuthorizationGuard)
@Roles(Role.User, Role.Admin, Role.Instructor)
  @Delete(':username')
  async deleteStudent(@Param('username') username: string) {
    // Deleting the student and associated data
    await this.studentService.deleteStudentAndRelatedData(username);
    return { message: 'Student and related data deleted successfully.' };
  }

    @Roles(Role.User, Role.Admin, Role.Instructor)
    @Get('levelEasy/:courseId')
  async getEasylevell(@Param('courseId') courseId:mongoose.Types.ObjectId){
    return await this.studentService.getnumberOfEasyLevel(courseId);
  }
@Roles(Role.User, Role.Admin, Role.Instructor)
@Get('mediumLevel/:courseId')
async getMediumLevel(@Param('courseId') courseId:mongoose.Types.ObjectId){
  return await this.studentService.getnumberMediumLevel(courseId);
}
@Roles(Role.User, Role.Admin, Role.Instructor)
@Get('hardLevel/:courseId')
async getHardLevel(@Param('courseId') courseId:mongoose.Types.ObjectId){
  return await this.studentService.getnumberHardLevel(courseId);
  
}
  
}


