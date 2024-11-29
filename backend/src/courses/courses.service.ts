
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { courseDocument, Courses } from './courses.schema';
import { Module } from '../modules/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { ModulesService } from '../modules/modules.service';
import { CreateModuleDto } from 'src/modules/dto/CreateModule.dto';
import { moduleDocument } from '../modules/modules.schema';

import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
@Injectable()
export class CoursesService {
    constructor(
    @InjectModel(Courses.name) private readonly courseModel: Model<Courses>,
    @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
      @Inject(forwardRef(() => ModulesService)) private readonly modulesService: ModulesService, // Inject ModulesService with forwardRef
    ) {}
    
    
async findAll(): Promise<Courses[]> {
    return this.courseModel.find().exec();
  }


  async findOne(course_code: string): Promise<Courses> {
    const course = await this.courseModel.findOne({course_code}).exec();
    if (!course) {
      throw new NotFoundException(`Course with course code ${course_code} not found`);
    }
    return course;
  }

  // Create a new course
  async create(createCourseDto: CreateCourseDto): Promise<Courses> {
    const newCourse = new this.courseModel(createCourseDto);
    return await newCourse.save();
  }

 // Update an existing course by ID
  async update(course_code: string, updateCourseDto: UpdateCourseDto): Promise<courseDocument> {
    const updatedCourse = await this.courseModel
      .findOneAndUpdate({ course_code }, updateCourseDto, { new: true })
      .exec();
  
    if (!updatedCourse) {
      throw new NotFoundException(  `Course with Course code${course_code} not found`);
    }
    return updatedCourse;
  }

  
  
  

 

  // Delete a course by course_code
  async delete(course_code: string): Promise<Courses> {
    const deletedCourse = await this.courseModel.findOneAndDelete({course_code}).exec();
    if (!deletedCourse) {
      throw new NotFoundException(`Course code with course_code ${course_code} not found`);
    }
    return deletedCourse;
  }
//GET/courses/:course_code: retrieve all modules of a speicifc course
  // async getModulesForCourse(course_code: string): Promise<Module> {
  //   const course = await this.findOne(course_code); // Fetch the course by its code

  //   const modules = await Promise.all(
  //     course.modules.map((moduleId) =>
  //       this.modulesService.findById(moduleId), // Fetch each module by its ObjectId
  //     ),
  //   );

  //   return modules;
  // }




  async getModulesForCourse(course_code: string): Promise<Module[]> {
    const course = await this.findOne(course_code);
  
    if (!course) {
      throw new NotFoundException(`Course with code ${course_code} not found`);
    }
  
    // Fetch all modules by their ObjectIds
    const modules = await this.moduleModel.find({
      _id: { $in: course.modules }, // Match ObjectIds in `course.modules`
    }).exec();
  
    return modules;
  }
  
  
  


  //PUT: add module to course 
//   async addModuleToCourse(courseCode: string,createModuleDto: CreateModuleDto,): Promise<Courses> {
//     const newModule = await this.modulesService.create(createModuleDto); // create new module
//     const course = await this.courseModel.findOne({ course_code: courseCode }).exec();
//   if (!course) {
//     throw new NotFoundException(`Course with Course code ${courseCode} not found`);
//   }
//   course.modules.push(newModule._id);
  

//   // Step 4: Save the updated course with the new module reference
//   const updatedCourse = await course.save();

//   return updatedCourse; 
// }


// async addModuleToCourse(courseCode: string, createModuleDto: CreateModuleDto): Promise<Courses> {
//   // Step 1: Create a new module using the createModuleDto
//   const newModule = await this.modulesService.create(createModuleDto);

//   // Step 2: Fetch the course using the provided course code
//   const course = await this.courseModel.findOne({ course_code: courseCode }).exec();
  
//   // Step 3: Check if the course exists, and throw an exception if not
//   if (!course) {
//     throw new NotFoundException(`Course with Course code ${courseCode} not found`);
//   }

//   // Step 4: Add the new module's _id to the course's modules array
//   course.modules.push(newModule._id);

//   // Step 5: Save the updated course with the new module reference
//   const updatedCourse = await course.save();

//   // Step 6: Return the updated course
//   return updatedCourse;
// }



async addModuleToCourse(courseCode: string, createModuleDto: CreateModuleDto): Promise<Courses> {
  // Create new module and save it to the database
  const newModule = await this.modulesService.create(createModuleDto);

  // Check if the module was created successfully and has an _id
  if (!newModule || !newModule._id) {
    throw new Error('Failed to create the module.');
  }

  // Find the course by course code
  const course = await this.courseModel.findOne({ course_code: courseCode }).exec();
  if (!course) {
    throw new NotFoundException(`Course with Course code ${courseCode} not found`);
  }

  // Add the module's _id to the course's modules array
  course.modules.push(newModule._id);

  // Save the updated course document
  const updatedCourse = await course.save();

  return updatedCourse;
}











//PUT: remove module from array of modules in specific course
async DeleteModuleFromCourse(courseCode: string, title:string): Promise<Courses> {
  const deletedModule= await this.modulesService.delete(title);
  // Use $pull to remove the moduleId from the modules array atomically
  const updatedCourse = await this.courseModel.findOneAndUpdate({ course_code: courseCode }, { $pull: { modules: deletedModule._id} },{ new: true } ).exec();
  if (!updatedCourse) {
    throw new NotFoundException(`Course with course code ${courseCode} not found`);
  }

  return updatedCourse;  // Return the updated course
}


}