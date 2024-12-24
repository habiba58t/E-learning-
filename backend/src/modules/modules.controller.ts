
import {  UseInterceptors, UploadedFile, Patch,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid'; // to generate unique file names
import { ModulesService } from './modules.service';
import * as mongoose from 'mongoose';
import { Controller, Get, Post, Body, Param, Put, Delete,NotFoundException, InternalServerErrorException,UseGuards ,Req,BadRequestException} from '@nestjs/common';
import { Module } from './modules.schema';
import { Quiz, QuizzesDocument } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';
import {Question} from '../questions/questions.schema'
import { Notes } from 'src/notes/notes.schema';
import { moduleDocument } from './modules.schema';
import { Content } from 'src/content/content.schema';
import { notesDocument } from 'src/notes/notes.schema';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';


@Controller('modules')

export class ModulesController {
constructor(private readonly modulesService: ModulesService) {}

//GET: get all modules
@UseGuards(AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Get()
  async findAll(): Promise<moduleDocument[]> {
    return this.modulesService.findAll();
  }

//GET: get one module by objectId
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor, Role.User)
  @Get('id/:ObjectId')
  async findById(@Param('ObjectId') ObjectId: string): Promise<moduleDocument> {
    const objectId = new mongoose.Types.ObjectId(ObjectId);
    return this.modulesService.findById(objectId);
  }

//GET: get one module by title
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.Admin,Role.User,Role.Instructor)
@Get('mtitle/:title')
async findByTitle(@Param('title') title: string): Promise<moduleDocument> {
  return this.modulesService.findByTitle(title);
} 

 // POST /module: Create a new module
 @UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
 @Post('/create')
 async create(@Body() createModuleDto: CreateModuleDto): Promise<moduleDocument> {
  return await this.modulesService.create(createModuleDto);
 }
 
 // PUT /module/:title: Update an existing module by its title
 @UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
 @Put(':username/:title/updateModule')
 async update(@Param('username') username:string,@Param('title') title: string, @Body() updateModuleDto: UpdateModuleDto): Promise<moduleDocument> {
   return this.modulesService.update(title, updateModuleDto,username);
 }
// DELETE /modules/:title: Delete a module by its title
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Delete(':title')
async delete(@Param('title') title: string): Promise<moduleDocument> {
  return this.modulesService.delete(title);
}



@Get('/find-module/:quizId')
//implemented by farah for use in quiz
@UseGuards(AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor, Role.User)
async findModuleByQuizId(@Param('quizId') quizId: string): Promise<moduleDocument>{
  return this.modulesService.findModuleByQuizId(quizId)
}

//GET: find array of questions by moduleId
@UseGuards(AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
@Get('id/:ObjectId')             
async getQuestionsForModule(@Param('ObjectId') ObjectId: string): Promise<Question[]> {
  const objectId = new mongoose.Types.ObjectId(ObjectId);
  return this.modulesService.getQuestionsForModule(objectId);
} 


//GET: find array of quizzes  by moduleId
// @UseGuards(AuthorizationGuard)
//  @Roles(Role.Admin,Role.Instructor, Role.User)
@Get('/quiz/id/:ObjectId')             
async getQuizzesForModule( @Param('ObjectId') ObjectId: string): Promise<QuizzesDocument[]> {
  const objectId = new mongoose.Types.ObjectId(ObjectId);
  return this.modulesService.getQuizzesForModule(objectId);
} 

//ADD QUIZ TO MODULE
@UseGuards(AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
@Put(':moduleId/add-quiz/:quizId')
  async addQuizToModule(@Param('moduleId') moduleId: string,@Param('quizId') quizId: string, // Quiz ID as string
  ) {
    const updatedModule = await this.modulesService.addQuizToModule(new mongoose.Types.ObjectId(moduleId),new mongoose.Types.ObjectId(quizId));

    return {
      message: 'Quiz successfully added to the module.',
      module: updatedModule,
    };
  }



  //ADD QUESTION TO MODULE
  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
@Put(':moduleId/add-question/:quizId')
async addQuestionToModule( @Req() {user},@Param('moduleId') moduleId: string, @Param('questionId') questionId: string, // Quiz ID as string
) {
  const updatedModule = await this.modulesService.addQuestionToModule(
    new mongoose.Types.ObjectId(moduleId), 
    new mongoose.Types.ObjectId(questionId));
  return {
    message: 'Question successfully added to the module.',
    module: updatedModule,
  };
}
  
//GET: find outdated attributed of specific module
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
@Get(':title')
  async findOutdated(@Param('title') title: string): Promise<boolean> {
    return this.modulesService.findOutdated(title);
  }

  //PUT: toggle outdated attributed of specific module
  @UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
  @Put('toggle/:username/:title')
  async toggleOutdated(@Param('username')username:string,@Param('title') title: string): Promise<moduleDocument> {
    return this.modulesService.toggleOutdated(title,username);
  } 

//get content for specific module
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor, Role.User)
  @Get(':username/:title/contentAdmin')
  async getContentForModule2(@Param('username') username: string,@Param('title') title: string): Promise<Content[]> {
    return this.modulesService.getContentForModule2(username, title);
  }


// Upload files to resourses array
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)
@Post(':username/:moduleId/upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads', // Save in uploads folder
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtName}`;
        callback(null, fileName);
      },
    }),
  })
)
async addContentToModule(
  @Param('username') username: string,
  @Param('moduleId') moduleId: string,
  @Body('contentTitle') contentTitle: string,
  @UploadedFile() file: Express.Multer.File,
) {
  if (!username) throw new BadRequestException('Username is required.');
  if (!moduleId) throw new BadRequestException('Module ID is required.');
  if (!contentTitle) throw new BadRequestException('Content title is required.');
  if (!file) throw new BadRequestException('File is required.');

  try {
    const fileUrl = `/uploads/${file.filename}`;
    const fileType = file.mimetype;
    const originalName = file.originalname;

    const updatedModule = await this.modulesService.addContentToModule(
      moduleId,
      fileUrl,
      originalName,
      fileType,
      contentTitle,
      username,
    );

    return {
      message: 'File uploaded successfully!',
      file: fileUrl,
      module: updatedModule,
    };
  } catch (error) {
    console.error('Error in addContentToModule:', error);
    throw new InternalServerErrorException('Failed to upload content.');
  }
}

//get content for specific module
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor, Role.User)
  @Get(':username/:title/content')
  async getContentForModule(@Param('username') username: string,@Param('title') title: string): Promise<Content[]> {
    return this.modulesService.getContentForModule(username, title);
  }


// Delete modules and all related quizzes and questions 
@UseGuards(AuthGuard,AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor)
  @Delete(':username/:moduleId/deleteModule')
  async deleteModule(@Param('username')username:string,@Param('moduleId') moduleId: string) {
    try {
      const moduleObjectId = new mongoose.Types.ObjectId(moduleId); // Convert moduleId to ObjectId

      // Call the service to delete the module and its related data
      const result = await this.modulesService.deleteModule(moduleObjectId,username);

      return {
        message: result.message, // Return success message from service
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      // General error handling for issues like database connection errors
      throw new InternalServerErrorException('Failed to delete the module or related data.');
    }
  }

  // //Get AverageRating  of module
  @UseGuards(AuthorizationGuard)
@Roles(Role.Admin,Role.Instructor,Role.User)
  @Get(':ObjectId')
  async getAverageRating(@Param('ObjectId') ObjectId: string): Promise<number> {
    const objectId = new mongoose.Types.ObjectId(ObjectId);
   return await this.modulesService.getAverageRating(objectId);
  }

//SET TOTALRATING TOTALSTUDENTS AVERAGE RATING
// @UseGuards(AuthorizationGuard)
//  @Roles(Role.User)
@Put('/setRating/:objectId/:score')
async setRating(
  @Param('objectId') objectId: string,
  @Param('score') score: number
): Promise<void> {
  const objectIdInstance = new mongoose.Types.ObjectId(objectId);
  await this.modulesService.setRating(objectIdInstance, score);
}


//GET NOTES FOR SPECIFIC USER 
@UseGuards(AuthGuard, AuthorizationGuard)
 @Roles(Role.User)
@Get(':username/:title')
  async getNotesForUserAndNote(@Param('username') username: string,@Param('title')title:string): Promise<notesDocument[]>{
   return await this.modulesService.getNotesForUserAndNote(username,title);
  }

//   //GET A SPECIFIC NOTE FOR A SPEICIFC MODULE
//   @UseGuards(AuthorizationGuard)
// @Roles(Role.User)
//   @Get(':objectid')
//   async getNoteForUser(@Param('notetId') notetId: mongoose.Types.ObjectId): Promise<notesDocument>{
//    return await this.modulesService.getNoteForUser(notetId);
//   }

  //Delete NOTE FOR A SPECIFIC NOTE
  @UseGuards(AuthorizationGuard)
  @Roles(Role.User)
  @Delete(':title/username/notid')
  async deleteNote(@Param('title')title:string, @Param('username')username:string,@Param('notetId') notetId: string): Promise<void>{
      await this.modulesService.deleteNote(title,username,notetId);
    }

 //CREATE NOTE FOR A SPECIFIC NOTE
//  @UseGuards(AuthorizationGuard)
//  @Roles(Role.User)
// @Post(':username')
// async createNote(@Param('username')username:string,@Body('title')title:string,@Body('content')content:string): Promise<notesDocument>{
//    return await this.modulesService.createNote(title,username,content);
//   }

  //UPDATE NOTE FOR A SPECIFIC NOTE
  @UseGuards(AuthorizationGuard)
 @Roles(Role.User)
@Put(':noteid')
async UpdateNote(@Param('notetId') notetId: mongoose.Types.ObjectId,@Body('contentNew')contentNew:string): Promise<notesDocument>{
   return await this.modulesService.UpdateNote(notetId,contentNew);
  }



  //toggle notes enable
  @UseGuards(AuthGuard, AuthorizationGuard)
    @Roles(Role.Admin, Role.Instructor)
    @Put('toggleNote/:moduleTitle')
    async toggleNote( @Param('moduleTitle') moduleTitle: string): Promise<void> {
       this.modulesService.toggleNote(moduleTitle);
    } 



    
}
