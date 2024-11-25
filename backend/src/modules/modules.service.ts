import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './modules.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';
import { QuizzesService } from '../quizzes/quizzes.service';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<Module>,
    @Inject(forwardRef(() => QuizzesService)) private readonly quizzesService: QuizzesService, // Inject ModulesService with forwardRef
  ) {}

    async findAll(): Promise<Module[]> {
        return this.moduleModel.find().exec();
      }

//get module by id for courses
      async findById(moduleId: mongoose.Schema.Types.ObjectId): Promise<Module> {
        const module = await this.moduleModel.findById(moduleId).exec();
        if (!module) {
          throw new NotFoundException(`Module with Object id ${moduleId} not found`);
        }
        return module;
      }
 //get module by title 
      async findByTitle(title: string): Promise<Module> {
        const module = await this.moduleModel.findById(title).exec();
        if (!module) {
          throw new NotFoundException(`Module with title ${title} not found`);
        }
        return module;
      }

// Create a new Module
async create(createModuleDto: CreateModuleDto): Promise<Module> {
  const newModule = new this.moduleModel(createModuleDto);
  return newModule.save();
}
// Update an existing module by title
async update(title: string, updateModuleDto: UpdateModuleDto): Promise<Module> {
  const updatedModule = await this.moduleModel.findByIdAndUpdate(title, updateModuleDto, { new: true }).exec();
  if (!updatedModule) {
    throw new NotFoundException(`Module with title${title} not found`);
  }
  return updatedModule;
}

// Delete a module by title
async delete(title: string): Promise<Module> {
  const deletedModule = await this.moduleModel.findByIdAndDelete(title).exec();
  if (!deletedModule) {
    throw new NotFoundException(`Module with title ${title} not found`);
  }
  return deletedModule;
}

//GET/modules/:title: retrieve all quizzes for specific module 
//async getQuizForModule(title: string): Promise<Quiz[]> {
 // const module = await this.findByTitle(title); // Fetch the module by its title

  //const quizzes = await Promise.all(
    //module.quizzes.map((moduleId) =>
      //this.quizzesService.findOne(moduleId), // Fetch each quiz by its
    //),
  //);

  //return quizzes;
//}
}
