
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
import { Users } from 'src/users/users.schema';

@Injectable()
export class CoursesService {
    constructor(
      @InjectModel(Courses.name) private courseModel: Model<Courses>,
      @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
      @InjectModel(Users.name) private readonly userModel: Model<Users>,
      @Inject(forwardRef(() => ModulesService)) private readonly modulesService: ModulesService, // Inject ModulesService with forwardRef
    ) {}
    
    
async findAll(): Promise<Courses[]> {
    return this.courseModel.find().exec();
  }

//GET: find course by course code
  async findOne(course_code: string): Promise<Courses> {
    const course = await this.courseModel.findOne({course_code}).exec();
    if (!course) {
      throw new NotFoundException(`Course with course code ${course_code} not found`);
    }
    return course;
  }

  //GET: find course by course code
  async findCourseByTitle(title: string): Promise<Courses> {
    const course = await this.courseModel.findOne({title}).exec();
    if (!course) {
      throw new NotFoundException(`Course with title ${title} not found`);
    }
    return course;
  }

  //get module by id for courses
  async findById(ObjectId: mongoose.Schema.Types.ObjectId): Promise<Courses> {
    const course = await this.courseModel.findById(ObjectId).exec();
    if (!course) {
      throw new NotFoundException(`course with Object id ${ObjectId} not found`);
    }
    return course;
  }


  // Create a new course
   async create(createCourseDto: CreateCourseDto): Promise<Courses> {
     const newCourse = new this.courseModel(createCourseDto);
     newCourse.created_at= new Date();
    
     return await newCourse.save();
   }

  // async create(createCourseDto: CreateCourseDto, username: string): Promise<Courses> {
  //   // Step 1: Create the new course
  //   const newCourse = new this.courseModel(createCourseDto);
  //   return newCourse.save();
  // }

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
 // course.modules.push(newModule._id);

  // Save the updated course document
  const updatedCourse = await course.save();

  return updatedCourse;
}











// //PUT: remove module from array of modules in specific course
// async DeleteModuleFromCourse(courseCode: string, title:string): Promise<Courses> {
//   const deletedModule= await this.modulesService.delete(title);
//   // Use $pull to remove the moduleId from the modules array atomically
//   const updatedCourse = await this.courseModel.findOneAndUpdate({ course_code: courseCode }, { $pull: { modules: deletedModule._id} },{ new: true } ).exec();
//   if (!updatedCourse) {
//     throw new NotFoundException(`Course with course code ${courseCode} not found`);
//   }

//   return updatedCourse;  // Return the updated course
// }


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


//GET: find course outdated attribute by course code
async findOutdated(course_code: string): Promise<boolean> {
  const course = await this.courseModel.findOne({ course_code }, { isOutdated: 1, _id: 0 }) 
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }

  return course.isOutdated;
}

//PUT: change outdated of course
async toggleOutdated(course_code: string): Promise<Courses> {
  const course = await this.courseModel.findOne({ course_code }).exec();
  if (!course) {
    throw new NotFoundException(`Course with course code ${course_code} not found`);
  }
  course.isOutdated = !course.isOutdated;
  return await course.save();
}
// Get modules that are not outdated and match student level for student
async getModulesForCourseStudent(course_code: string, username: string): Promise<Module[]> {
  // Step 1: Fetch the student by their username
  const student = await this.userModel.findOne({ username }).exec();
  if (!student) {
    throw new NotFoundException(`Student with username ${username} not found`);
  }

  // Step 2: Fetch the course by its code
  const course = await this.findOne(course_code);
  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Step 3: Fetch all modules for the course
  const modules = await this.moduleModel.find({
    _id: { $in: course.modules }, // Match ObjectIds in `course.modules`
  }).exec();

  // Step 4: Filter the modules based on the student's level and outdated status
  const validModules = modules.filter(module => 
    module.level === student.studentLevel && !module.isOutdated
  );

  return validModules;
}




async getModulesForCourseInstructor(course_code: string): Promise<Module[]> {
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









// Get Average score of a specific module 
async getAverageScoreForCourse(course_code: string): Promise<number> {
  // Step 1: Find the course and deeply populate nested fields
  const course = await this.courseModel
    .findOne({ course_code })
    .populate({
      path: 'modules', // Populate modules
      populate: {
        path: 'quizzes', // Populate quizzes within modules
        populate: {
          path: 'responses', // Populate responses within quizzes
          select: 'score', // Only fetch the 'score' field
        },
      },
    })
    .exec();

  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Step 2: Traverse through populated modules, quizzes, and responses
  let totalScore = 0;
  let totalResponses = 0;

  course.modules.forEach((module: any) => {
    module.quizzes.forEach((quiz: any) => {
      quiz.responses.forEach((response: any) => {
        totalScore += response.score; // Accumulate scores
        totalResponses += 1; // Count responses
      });
    });
  });

  // Step 3: Calculate average and return
  if (totalResponses === 0) {
    return 0; // No responses, average is 0
  }

  const averageScore = totalScore / totalResponses;
  return averageScore;
}



}