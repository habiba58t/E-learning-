import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses} from './courses.schema';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { Module } from '../modules/modules.schema';
import { CreateModuleDto } from '../modules/dto/CreateModule.dto';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { UpdateModuleDto } from 'src/modules/dto/UpdateModule.dto';
import { courseDocument } from './courses.schema';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    //GET ALL COURSES   //PUBLIC 
@Get()
  async findAll(): Promise<{ title: string; description: string }[]> {
    return this.coursesService.findAll();
  
  }

  // GET /Course/:course code: Retrieve a specific product by its ID
  @Get(':course_code')
  async findOne(@Param('course_code') course_code: string): Promise<Courses> {
    return this.coursesService.findOne(course_code);
  }

  // GET /Course/:course code: Retrieve a specific product by its ID
  @Get(':title')
  async findCourseByTitle(@Param('title') title: string): Promise<Courses> {
    return this.coursesService.findCourseByTitle(title);
  }

  @Get('id/:ObjectId')
  async findById(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<Courses> {
    return this.coursesService.findById(ObjectId);
  }

  // POST /courses: Create a new product
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Courses> {
    const newCourse=  await this.coursesService.create(createCourseDto);
    return newCourse;

  }


  // @Post(':username')
  // async create(
  //   @Param('username') username: string,  // Get instructor username from URL
  //   @Body() createCourseDto: CreateCourseDto  // Get course data from the body
  // ): Promise<Courses> {
  //   // Pass the username and course data to the service to create the course and associate it with the instructor
  //   return this.coursesService.create(createCourseDto,username);
  // }

  // PUT /products/:id: Update an existing product by its ID
  @Put(':course_code')
  async update(@Param('course_code') course_code: string, @Body() updateCourseDto: UpdateCourseDto): Promise<Courses> {
    return this.coursesService.update(course_code, updateCourseDto);
  }





  // DELETE /courses/:course_code: Delete a product by its ID
  @Delete(':course_code')
  async delete(@Param('course_code') course_code: string): Promise<Courses> {
    return this.coursesService.delete(course_code);
  }
//GET/courses/:course_code: retrieve all modules of a speicifc course
  // @Get(':course_code/modules')
  // async getModulesForCourse(@Param('course_code') course_code: string): Promise<Module[]> {
  //   return this.coursesService.getModulesForCourse(course_code);
  // }


  // Get modules for a student in a specific course
  @Get(':course_code/modules/:username')
  async getModulesForCourseStudent(
    @Param('course_code') course_code: string,
    @Param('username') username: string
  ): Promise<Module[]> {
    try {
      // Call the service method to get the filtered modules for the student
      return await this.coursesService.getModulesForCourseStudent(course_code, username);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get(':course_code/modules')
  async getModulesForInstructor(
    @Param('course_code') course_code: string,): Promise<Module[]> {
    // Call the service method to get the modules for the course
    const modules = await this.coursesService.getModulesForCourseInstructor(course_code);
    
    if (!modules || modules.length === 0) {
      throw new NotFoundException(`No modules found for course ${course_code}`);
    }

    return modules;
  }



  @Put(':courseCode/modules')
  async addModuleToCourse( @Param('courseCode') courseCode: string,@Body() createModuleDto: CreateModuleDto): Promise<Courses> {
    return this.coursesService.addModuleToCourse(courseCode, createModuleDto);
}



 @Put(':courseCode/modules/title')
async DeleteModuleFromCourse( @Param('courseCode') courseCode: string , @Param ('title')title:string): Promise<Courses> {
  return this.coursesService.DeleteModuleFromCourse(courseCode, title);
}

//GET: find outdated attributed of specific course
@Get(':course_code')
  async findOutdated(@Param('course_code') course_code: string): Promise<boolean> {
    return this.coursesService.findOutdated(course_code);
  }

  @Put(':course_code')
  async toggleOutdated(@Param('course_code') course_code: string): Promise<Courses> {
    return this.coursesService.toggleOutdated(course_code);
  } 



  // Get average score of a specific course 
  @Get(':course_code/average-score')
async getAverageScore(@Param('course_code') course_code: string): Promise<{ averageScore: number }> {
  const averageScore = await this.coursesService.getAverageScoreForCourse(course_code);
  return { averageScore };
}

// //Get totalRating
//   @Get(':courseId/total-rating')
//   async getTotalRating(@Param('courseId') courseId: string): Promise<{ totalRating: number }> {
//     const course = await this.coursesService.getCourseById(courseId);
//     return { totalRating: course.totalRating || 0 };
//   }


}