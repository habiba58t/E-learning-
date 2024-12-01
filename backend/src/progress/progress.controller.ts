import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';
import { updateProgressDTo } from './dto/updateProgress.dto';
import { CreateProgressDTo } from './dto/createProgress.dto';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getAllProgress(): Promise<Progress[]> {
    return await this.progressService.findAll();
  }

  @Get('course/:course_code') // Changed path
  async getAllByCourse(@Param('course_code') course_code: string): Promise<Progress[]> {
    return await this.progressService.findAllByCourse(course_code);
  }

  @Get('user-course/:Username/:course_code') // Changed path
  async getProgressByUsernameAndCourse(
    @Param('Username') Username: string,
    @Param('course_code') course_code: string,
  ) {
    const progress = await this.progressService.findByUsernameAndCourseCode(Username, course_code);
    return progress;
  }

  @Get('students-in-course/:course_code') // Changed path
  async getProgressByCourse(@Param('course_code') course_code: string): Promise<Progress> {
    return await this.progressService.findbyCourseCode(course_code);
  }

  @Get('user/:Username') // Changed path
  async getProgressByUsername(@Param('Username') Username: string): Promise<Progress[]> {
    return await this.progressService.findbyUsername(Username);
  }

  @Put('update/:course_code/:Username') // Changed path
  async updateProgress(
    @Param('course_code') course_code: string,
    @Param('Username') Username: string,
    @Body() progressData: updateProgressDTo,
  ) {
    const updatedProgress = await this.progressService.update(course_code, Username, progressData);
    return updatedProgress;
  }

  @Post('create') // Changed path
  async createProgress(@Body() progressData: CreateProgressDTo) {
    const newProgress = await this.progressService.create(progressData);
    return newProgress;
  }

  @Delete('delete/:course_code/:Username') // Changed path
  async deleteProgress(@Param('course_code') course_code: string, @Param('Username') Username: string) {
    const deletedProgress = await this.progressService.delete(course_code, Username);
    return deletedProgress;
  }

  @Get('enrolled/:course_code') // Changed path
  async getAllEnrolled(@Param('course_code') course_code: string): Promise<number> {
    return await this.progressService.findNumberOfStudentsEnrolled(course_code);
  }

  @Get('completed/:course_code') // Changed path
  async getStudentsCompleted(@Param('course_code') course_code: string): Promise<Progress[]> {
    return await this.progressService.findAllStudentsCompleted(course_code);
  }

  @Get('total-modules/:course_code') // Changed path
  async getTNModules(@Param('course_code') course_code: string): Promise<number> {
    return await this.progressService.getTotalModules(course_code);
  }

  @Get('modules-completed/:course_code/:Username') // Changed path
  async getModulesCompleted(
    @Param('course_code') course_code: string,
    @Param('Username') Username: string,
  ): Promise<number> {
    return await this.progressService.getTotalModulesCompleted(course_code, Username);
  }

  @Get('enrolledStudents/:course_code')
  async getEnrolledStudents(@Param('course_code') course_code:string):Promise<string[]>{
    return await this.progressService.findAllStudentsEnrolled(course_code);
  }

 /* @Put('complettionPercentage/:Username')
  async UpdateCompletionPercentage(@Param('Username') Username:string)*/
}
