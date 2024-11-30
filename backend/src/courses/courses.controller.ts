import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException  } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Courses} from './courses.schema';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { Module } from '../modules/modules.schema';
import { CreateModuleDto } from '../modules/dto/CreateModule.dto';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { UpdateModuleDto } from 'src/modules/dto/UpdateModule.dto';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

@Get()
  async findAll(): Promise<Courses[]> {
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

  // POST /products: Create a new product
  @Post()
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Courses> {
    return this.coursesService.create(createCourseDto);
  }

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
  @Get(':course_code/modules')
  async getModulesForCourse(
    @Param('course_code') course_code: string,
  ): Promise<Module[]> {
    // Call the service method to get the modules for the course
    const modules = await this.coursesService.getModulesForCourse(course_code);
    
    if (!modules || modules.length === 0) {
      throw new NotFoundException(`No modules found for course ${course_code}`);
    }

    return modules;
  }



  @Put(':courseCode/modules')
  async addModuleToCourse( @Param('courseCode') courseCode: string,@Body() createModuleDto: CreateModuleDto): Promise<Courses> {
    return this.coursesService.addModuleToCourse(courseCode, createModuleDto);
}



//@Put: delete module from course
//async DeleteModuleFromCourse( @Param('courseCode') courseCode: string , @Param ('title')title:string): Promise<Courses> {
 // return this.coursesService.DeleteModuleFromCourse(courseCode, title);
//}


}
