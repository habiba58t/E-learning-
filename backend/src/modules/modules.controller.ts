
import {  UseInterceptors, UploadedFile,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // to generate unique file names
import { ModulesService } from './modules.service';
import * as mongoose from 'mongoose';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Module } from './modules.schema';
import { Quiz } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';
import {Question} from '../questions/questions.schema'
import { Note } from 'src/notes/notes.schema';
import { moduleDocument } from './modules.schema';


@Controller('modules')

export class ModulesController {
constructor(private readonly modulesService: ModulesService) {}

//GET: get all modules
@Get()
  async findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  
  }

//GET: get one module by objectId
  @Get('id/:ObjectId')
  async findById(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<Module> {
    return this.modulesService.findById(ObjectId);
  }

//GET: get one module by title
@Get('title/:title')
async findByTitle(@Param('title') title: string): Promise<Module> {
  return this.modulesService.findByTitle(title);
} 

 // POST /module: Create a new module
 @Post()
 async create(@Body() createModuleDto: CreateModuleDto): Promise<moduleDocument> {
  return await this.modulesService.create(createModuleDto);
 }
 
 // PUT /module/:title: Update an existing module by its title
 @Put(':title')
 async update(@Param('title') title: string, @Body() updateModuleDto: UpdateModuleDto): Promise<Module> {
   return this.modulesService.update(title, updateModuleDto);
 }
// DELETE /modules/:title: Delete a module by its title
@Delete(':title')
async delete(@Param('title') title: string): Promise<moduleDocument> {
  return this.modulesService.delete(title);
}

//GET retrieve all quizzes of a module
//@Get(':title/quizzes')
//async getQuizForModule(@Param('title') title: string): Promise<Quiz[]> {
  //return this.modulesService.getQuizForModule(title);
//}


//GET retrieve all quizzes of a module
// @Get(':title/questions')
// async getQuestionsForModule(@Param('title') title: string): Promise<Question[]> {
//   return this.modulesService.getQuestionsForModule(title);
//  }

//GET: find array of questions by moduleId
@Get('id/:ObjectId')             
async findQuestionsByModuleId(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
  return this.modulesService.findQuestionsByModuleId(ObjectId);
}

// @Get(':moduleId/:questionId')
// async AddQuestionToModule(@Param('moduleId') moduleId: mongoose.Schema.Types.ObjectId, @Param('questionId') questionId: mongoose.Schema.Types.ObjectId  ): Promise<void>{
//    this.modulesService.AddQuestionToModule(moduleId,questionId);
// }

//ADD QUIZ TO MODULE





 //GET retrieve all notes of a module
// @Get(':title/notes')
// async getNotesForModule(@Param('title') title: string): Promise<Note[]> {
//   return this.modulesService.getNotesForModule(title);
//  }
}

