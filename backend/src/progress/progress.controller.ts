import { Body, Controller, Delete, Get, Param, Post, Put  } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';
import { updateProgressDTo } from './dto/updateProgress.dto';
import { CreateCourseDto } from 'src/courses/dto/CreateCourse.dto';
import { CreateProgressDTo } from './dto/createProgress.dto';

@Controller('progress')
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Get()
    async getAllprogress():Promise<Progress[]>{
        return await this.progressService.findAll();
    }

    @Get(':course_code')
    async getAllBycourse(@Param('course_code')course_code:string):Promise<Progress[]>{
      return await this.progressService.findAllByCourse(course_code);
    }
    

    @Get(':username/:course_code')
    async getProgressByUsernameAndCouse(
      @Param('username') username: string,
      @Param('course_code') course_code: string
    ) {
      const progress = await this.progressService.findByUsernameAndCourseCode(username, course_code);
      return progress;
    }


    
   //get by course code only 
   //return 
   @Get(':course_code') //find all students fl course da
   async getProgressByCourse(@Param('course_code') course_code:string):Promise<Progress>{
    return await this.progressService.findbyCourseCode(course_code);

   }
   //get by username only
   @Get(':username')
   async getProgressByUsername(@Param('username') username:string):Promise<Progress[]>{
    return await this.progressService.findbyUsername(username);
   }

   @Put(':course_code/:username')
   async UpdateProgresss(@Param('course_code') course_code:string,@Param('username') username:string,@Body()progressData:updateProgressDTo){
    const updatedProgress= await this.progressService.update(course_code, username, progressData);
    return updatedProgress;
   }
   
   @Post()
   async createProgress(@Body() progressData: CreateProgressDTo) {
     // Check if progressService.create() is defined and working correctly.
     const newProgress = await this.progressService.create(progressData);
     
     // Optionally, you can return a status message or some additional data.
     return newProgress;
   }

   @Delete(':course_code/:username')
   async deleteProgress(@Param('course_code') course_code:string,@Param('username') username:string){
    const deletedProgress= await this.progressService.delete(course_code,username);
    return deletedProgress;
   }

   @Get(':course_code')
   async getAllEnrolled(@Param('course_code') course_code:string):Promise<number>{
    return await this.progressService.findAllStudentsEnrolled(course_code);

   }
   @Get(':course_code')
   async getStudentsCompleted(@Param('course_code') course_code:string):Promise<Progress[]>{
    return await this.progressService.findAllStudentsCompleted(course_code);
   }

   @Get(':course_code')
   async getTNModules(@Param('course_code') course_code:string):Promise<number>{
    return await this.progressService.getTotalModules(course_code);
   }

   @Get(':course_code/:username')
   async getModulesCompleted(@Param('course_code') course_code:string, @Param('username') username:string):Promise<number>{
    return await this.progressService.getTotalModulesCompleted(course_code, username);
   }
  }