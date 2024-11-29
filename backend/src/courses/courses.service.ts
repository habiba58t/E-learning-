
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from './courses.schema';
import { Module } from '../modules/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { ModulesService } from '../modules/modules.service';
import { CreateModuleDto } from 'src/modules/dto/CreateModule.dto';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { moduleDocument } from '../modules/modules.schema';
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

  // Update an existing course by ID
  async update(course_code: string, updateCourseDto: UpdateCourseDto): Promise<Courses> {
    const updatedCourse = await this.courseModel.findOneAndUpdate({course_code, updateCourseDto}, { new: true }).exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with Course code${course_code} not found`);
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
  async addModuleToCourse(courseCode: string,createModuleDto: CreateModuleDto,): Promise<Courses> {
    const newModule = await this.modulesService.create(createModuleDto); // create new module
    const course = await this.courseModel.findOne({ course_code: courseCode }).exec();
  if (!course) {
    throw new NotFoundException(`Course with Course code ${courseCode} not found`);
  }
  course.modules.push(newModule._id);

  // Step 4: Save the updated course with the new module reference
  const updatedCourse = await course.save();

  return updatedCourse; 
}

//PUT: remove module from array of modules in specific course
//async DeleteModuleFromCourse(courseCode: string, title:string): Promise<Courses> {
 // const deletedModule= await this.modulesService.delete(title);
  // Use $pull to remove the moduleId from the modules array atomically
  //const updatedCourse = await this.courseModel.findOneAndUpdate({ course_code: courseCode }, { $pull: { modules: deletedModule._id} },{ new: true } ).exec();
  //if (!updatedCourse) {
    //throw new NotFoundException(`Course with course code ${courseCode} not found`);
 // }

  //return updatedCourse;  // Return the updated course
//}


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

async getModulesForCourseStudent(course_code: string): Promise<Module[]> {
  const course = await this.findOne(course_code);

  if (!course) {
    throw new NotFoundException(`Course with code ${course_code} not found`);
  }

  // Fetch all modules by their ObjectIds
  const modules = await this.moduleModel.find({
    _id: { $in: course.modules }, // Match ObjectIds in `course.modules`
  }).exec();
  const validModules = modules.filter((modules) => !modules.isOutdated);
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

}