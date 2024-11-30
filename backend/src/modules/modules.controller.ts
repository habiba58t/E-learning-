
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
import { Content } from './content/content.schema';
import { contentDocument } from './content/content.schema';



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
// async getQuizForModule(@Param('title') title: string): Promise<Question[]> {
//   return this.modulesService.getQuestionsForModule(title);
//  }
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
//ADD QUIZ TO MODULE

 //GET retrieve all quizzes of a module
// @Get(':title/notes')
// async getNotesForModule(@Param('title') title: string): Promise<Note[]> {
//   return this.modulesService.getNotesForModule(title);
//  }

//GET: find outdated attributed of specific module
@Get(':title')
  async findOutdated(@Param('title') title: string): Promise<boolean> {
    return this.modulesService.findOutdated(title);
  }

  //PUT: toggle outdated attributed of specific module
  @Put(':title')
  async toggleOutdated(@Param('title') title: string): Promise<Module> {
    return this.modulesService.toggleOutdated(title);
  } 









// Upload files to resourses array

  @Post(':moduleId/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder to store uploaded files
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = `${uuidv4()}${fileExtName}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @Param('moduleId') moduleId: string, @Param('contentTitle') contentTitle: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Save the file metadata (e.g., file path) in the module
    const fileUrl = `/uploads/${file.filename}`; // Assuming files are served from '/uploads' folder
    const fileType = file.mimetype;
    const originalName = file.originalname;

    // Add the file metadata to the Module's resources array
    const updatedModule = await this.modulesService.addFileToModule(moduleId, fileUrl, originalName, fileType,contentTitle);

    return {
      message: 'File uploaded successfully!',
      file: fileUrl,
      module: updatedModule,
    };
  }
}

