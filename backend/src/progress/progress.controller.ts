import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';
import { updateProgressDTo } from './dto/updateProgress.dto';
import { CreateProgressDTo } from './dto/createProgress.dto';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
//import { Types } from 'mongoose';


@UseGuards(AuthGuard) // Apply AuthGuard globally to all methods


@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(AuthorizationGuard)
  @Roles(Role.Admin) 
  @Get()  //find all progresses 
  async getAllProgress(): Promise<Progress[]> {
    return await this.progressService.findAll();
  }

  @Get('course/:course_code') // Changed path
  async getAllByCourse(@Param('course_code') course_code: string): Promise<Progress[]> {
    return await this.progressService.findAllByCourse(course_code); //all progress for a specific course (hasa no guard)
  }


  @UseGuards(AuthorizationGuard) // Additional guard for authorization
  @Roles(Role.Admin, Role.Instructor) //admin??
  @Get('user-course/:Username/:course_code') //instructer beyshoof progress of a student 
  async getProgressByUsernameAndCourse(
    @Param('Username') Username: string,
    @Param('course_code') course_code: string,
  ) {
    const progress = await this.progressService.findByUsernameAndCourseCode(Username, course_code);
    return progress;
  }

  @Get('students-in-course/:course_code') //for a student finding a progress in a course 
  async getProgressByCourse(@Param('course_code') course_code: string): Promise<Progress> {
    return await this.progressService.findbyCourseCode(course_code);
  }

  @UseGuards(AuthorizationGuard) 
  @Roles(Role.Admin, Role.Instructor,Role.User) 
  @Get('user/:Username') // for instucters and students?? wala instucters bas
  async getProgressByUsername(@Param('Username') Username: string): Promise<Progress[]> {
    return await this.progressService.findbyUsername(Username);
  }

  @Put('update/:course_code/:Username') 
async updateProgress(@Param('course_code') course_code: string,@Param('Username') Username: string,@Body() progressData: updateProgressDTo,) {
    const updatedProgress = await this.progressService.update(course_code, Username, progressData);
    return updatedProgress;
  }
  @UseGuards(AuthorizationGuard)
  @Roles(Role.User)
  @Post('create') 
  async createProgress(@Body() progressData: CreateProgressDTo) {
    const newProgress = await this.progressService.create(progressData);
    return newProgress;
  }

  @Delete('delete/:course_code/:Username') //deletee mmkn admin 
  async deleteProgress(@Param('course_code') course_code: string, @Param('Username') Username: string) {
    const deletedProgress = await this.progressService.delete(course_code, Username);
    return deletedProgress;
  }

  @Delete('delete/:Username') //deletee mmkn admin 
  async deleteProgressByUsername( @Param('Username') Username: string) {
    await this.progressService.deleteProgressByUsername(Username);
  }

  @UseGuards(AuthorizationGuard)
  @Roles(Role.User, Role.Admin, Role.Instructor)
  @Get('enrolled/:course_code') //hasa no guard
  async getAllEnrolled(@Param('course_code') course_code: string): Promise<number> {
    return await this.progressService.findNumberOfStudentsEnrolled(course_code);
  }

  @UseGuards(AuthorizationGuard) 
  @Roles(Role.Admin, Role.Instructor) 
  @Get('completed/:course_code') //maybe instructer and admin
  async getStudentsCompleted(@Param('course_code') course_code: string): Promise<Progress[]> {
    return await this.progressService.findAllStudentsCompleted(course_code);
  }

  @UseGuards(AuthorizationGuard) 
  @Roles(Role.Admin, Role.Instructor) 
  @Get('completedNumber/:course_code')
  async getNumberCompleted(@Param('course_code') course_code:string): Promise<number>{
    return await this.progressService.getNumberOfCompletedStudents(course_code);
  }

  @Get('avgCompletion/:course_code')
  async getAvgCompletion(@Param('course_code') course_code:string):Promise<number>{
    return await this.progressService.AvgCompletionForAll(course_code);
  }

  

  // @Get('total-modules/:course_code') // Changed path
  // async getTNModules(@Param('course_code') course_code: string): Promise<number> {
  //   return await this.progressService.getTotalModules(course_code);
  // }

  // @Get('modules-completed/:course_code/:Username') // Changed path
  // async getModulesCompleted(
  //   @Param('course_code') course_code: string,
  //   @Param('Username') Username: string,
  // ): Promise<number> {
  //   return await this.progressService.getTotalModulesCompleted(course_code, Username);
  // }

  
  @Get('enrolledStudents/:course_code')
  async getEnrolledStudents(@Param('course_code') course_code:string):Promise<string[]>{
    return await this.progressService.findAllStudentsEnrolled(course_code);
  }

  @Get('completionPercentage/:Username')
  async getCompletionPercentage(@Param('Username') Username: string): Promise<number []>{
    return await this.progressService.setCompletionPercentage(Username);
  }

  

 /* @Put('complettionPercentage/:Username')
  async UpdateCompletionPercentage(@Param('Username') Username:string)*/
}