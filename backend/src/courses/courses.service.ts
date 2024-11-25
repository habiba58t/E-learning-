
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Courses } from './courses.schema';
import { Module } from '../modules/modules.schema';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/CreateCourse.dto';
import { UpdateCourseDto } from './dto/UpdateCourse.dto';
import { ModulesService } from '../modules/modules.service';

@Injectable()
export class CoursesService {
    constructor(
      @InjectModel(Courses.name) private courseModel: Model<Courses>,
      @Inject(forwardRef(() => ModulesService)) private readonly modulesService: ModulesService, // Inject ModulesService with forwardRef
    ) {}
    
    
async findAll(): Promise<Courses[]> {
    return this.courseModel.find().exec();
  }


  async findOne(course_code: string): Promise<Courses> {
    const course = await this.courseModel.findById(course_code).exec();
    if (!course) {
      throw new NotFoundException(`Course with course code ${course_code} not found`);
    }
    return course;
  }

  // Create a new product
  async create(createProductDto: CreateCourseDto): Promise<Courses> {
    const newProduct = new this.courseModel(createProductDto);
    return newProduct.save();
  }

  // Update an existing product by ID
  async update(course_code: string, updateCourseDto: UpdateCourseDto): Promise<Courses> {
    const updatedCourse = await this.courseModel.findByIdAndUpdate(course_code, updateCourseDto, { new: true }).exec();
    if (!updatedCourse) {
      throw new NotFoundException(`Course with Course code${course_code} not found`);
    }
    return updatedCourse;
  }


  // Delete a course by course_code
  async delete(course_code: string): Promise<Courses> {
    const deletedCourse = await this.courseModel.findByIdAndDelete(course_code).exec();
    if (!deletedCourse) {
      throw new NotFoundException(`Course code with course_code ${course_code} not found`);
    }
    return deletedCourse;
  }

  async getModulesForCourse(course_code: string): Promise<Module[]> {
    const course = await this.findOne(course_code); // Fetch the course by its code

    const modules = await Promise.all(
      course.modules.map((moduleId) =>
        this.modulesService.findOne(moduleId), // Fetch each module by its ObjectId
      ),
    );

    return modules;
  }
}