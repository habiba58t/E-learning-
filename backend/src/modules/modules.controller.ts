
import { ModulesService } from './modules.service';
import * as mongoose from 'mongoose';
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Module } from './modules.schema';
import { Quiz } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';

@Controller('modules')

export class ModulesController {
constructor(private readonly modulesService: ModulesService) {}


@Get()
  async findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  
  }


  @Get('id/:ObjectId')
  async findById(@Param('ObjectId') ObjectId: mongoose.Schema.Types.ObjectId): Promise<Module> {
    return this.modulesService.findById(ObjectId);
  }

@Get('title/:title')
async findByTitle(@Param('title') title: string): Promise<Module> {
  return this.modulesService.findByTitle(title);
} 
 // POST /products: Create a new module
 @Post()
 async create(@Body() createCourseDto: CreateModuleDto): Promise<Module> {
   return this.modulesService.create(createCourseDto);
 }
 
 // PUT /module/:title: Update an existing product by its title
 @Put('title')
 async update(@Param('title') title: string, @Body() updateModuleDto: UpdateModuleDto): Promise<Module> {
   return this.modulesService.update(title, updateModuleDto);
 }
// DELETE /modules/:title: Delete a product by its title
@Delete(':title')
async delete(@Param('title') title: string): Promise<Module> {
  return this.modulesService.delete(title);
}

//GET retrieve all quizzes of a module
//@Get(':title/quizzes')
//async getQuizForModule(@Param('title') title: string): Promise<Quiz[]> {
  //return this.modulesService.getQuizForModule(title);
//}
}

