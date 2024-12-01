import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { Controller, Delete, Param,  InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module} from './modules.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';
import { QuizzesService } from '../quizzes/quizzes.service';
import {Question} from '../questions/questions.schema'
import { QuestionsService } from 'src/questions/questions.service';
import { Note } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { moduleDocument } from './modules.schema';
import { Content } from './content/content.schema';
import { contentDocument } from './content/content.schema';
import { ContentService } from './content/content.service';



@Injectable()
export class ModulesService {
  constructor(
   // @InjectModel(Module.name) private moduleModel: Model<Module>,
    @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
    @InjectModel(Content.name) private readonly contentModel: Model<contentDocument>,
    @Inject(forwardRef(() => QuizzesService)) private readonly quizzesService: QuizzesService,
    @Inject(forwardRef(() => QuestionsService)) private readonly questionsService: QuestionsService,
    @Inject(forwardRef(() => NotesService)) private readonly notesService: NotesService, // Inject ModulesService with forwardRef
    @Inject(forwardRef(() => ContentService)) private readonly contentService: ContentService, 
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
        const module = await this.moduleModel.findOne({title}).exec();
        if (!module) {
          throw new NotFoundException(`Module with title ${title} not found`);
        }
        return module;
      }

// Create a new Module
async create(createModuleDto: CreateModuleDto): Promise<moduleDocument> {
  const newModule = new this.moduleModel(createModuleDto);
  newModule.created_at= new Date(); 
  return await newModule.save();
}
// Update an existing module by title
async update(title: string, updateModuleDto: UpdateModuleDto): Promise<moduleDocument> {
  const updatedModule = await this.moduleModel.findOneAndUpdate({title, updateModuleDto}, { new: true });
  if (!updatedModule) {
    throw new NotFoundException(`Module with title${title} not found`);
  }
  return updatedModule;
}

// Delete a module by title
async delete(title: string): Promise<moduleDocument> {
  const deletedModule = await this.moduleModel.findOneAndDelete({title}).exec();
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

//GET/modules/:title: retrieve all quizzes for specific module 
// async getQuestionForModule(title: string): Promise<Question[]> {
//   const module = await this.findByTitle(title); // Fetch the module by its title

//   const questions = await Promise.all(
//     module.questions.map((moduleId) =>
//       this.questionsService.findOne(moduleId), // Fetch each quiz by its
//     ),
//   );

//   return questions;
// }

//GET/modules/:title: retrieve all question for specific module 
// async getQuestionForModule(title: string): Promise<Question[]> {
//   const module = await this.findByTitle(title); // Fetch the module by its title

//   const questions = await Promise.all(
//     module.questions.map((moduleId) =>
//       this.questionsService.findOne(moduleId), // Fetch each quiz by its
//     ),
//   );

//   return questions;
// }

//Get array of quesiton by moduleId
async findQuestionsByModuleId(ObjectId: mongoose.Schema.Types.ObjectId): Promise<mongoose.Types.ObjectId[]> {
  const module = await this.moduleModel.findOne({ObjectId}).exec();
        if (!module) {
          throw new NotFoundException(`Module with ObjectId ${ObjectId} not found`);
        }
        return module.questions;
}


//GET/modules/:title: retrieve all quizzes for specific module 
// async getNotesForModule(title: string): Promise<Note[]> {
//   const module = await this.findByTitle(title); // Fetch the module by its title

//   const notes = await Promise.all(
//     module.notes.map((moduleId) =>
//       this.notesService.findOne(moduleId), // Fetch each quiz by its
//     ),
//   );

//   return notes;
// }

//GET: find course outdated attribute by course code
async findOutdated(title: string): Promise<boolean> {
  const module = await this.moduleModel.findOne({ title }, { isOutdated: 1, _id: 0 }) 
  if (!module) {
    throw new NotFoundException(`Course with module ${title} not found`);
  }

  return module.isOutdated;
}

//PUT: change outdated of course
async toggleOutdated(title: string): Promise<Module> {
  const module = await this.moduleModel.findOne({ title }).exec();
  if (!module) {
    throw new NotFoundException(`Course with module ${title} not found`);
  }
  module.isOutdated = !module.isOutdated;
  return await module.save();
}




// Method to add file metadata to a Module's resources
async addFileToModule(moduleId: string, fileUrl: string, originalName: string, fileType: string,contentTitle:string): Promise<Module> {
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new Error(`Module with ID ${moduleId} not found`);
  }

  // Create metadata for the uploaded file
  const fileMetadata = {
    filePath: fileUrl,
    fileType: fileType,
    originalName: originalName,
  };
// Create contentDto to match the CreateContentDto structure
// Create contentDto to match the CreateContentDto structure
const contentDto = {
  title: contentTitle, // The title field should match 'title' in CreateContentDto
  resources: [fileMetadata], // resources should be an array of file metadata objects
};

// Create content and pass it to the content service
const contents = await this.contentService.createContent(contentDto);
 module.content.push(contents._id);
 
  // Save the updated module
  await module.save();

  return module;
}









// delete module and all related quizzes and questions 
async deleteModule(moduleId: mongoose.Types.ObjectId): Promise<any> {
  // Step 1: Find the module to delete
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new NotFoundException(`Module with ID ${moduleId} not found`);
  }

  // Step 2: Extract related quizzes and questions
  const { quizzes = [], questions = [] } = module;

  // Step 3: Delete related Quizzes using Quizzes API
  try {
    if (quizzes.length > 0) {
      await Promise.all(
        quizzes.map(async (quizId) => {
          await this.quizzesService.deleteQuiz(new mongoose.Types.ObjectId(quizId));
        })
      );
    }
  } catch (error) {
    console.error("Error deleting quizzes for module:", error);
    throw new InternalServerErrorException("Failed to delete related quizzes for module.");
  }

  // Step 4: Delete related Questions using Questions API
  try {
    if (questions.length > 0) {
      await Promise.all(
        questions.map(async (questionId) => {
          await this.questionsService.delete(new mongoose.Types.ObjectId(questionId));
        })
      );
    }
  } catch (error) {
    console.error("Error deleting questions for module:", error);
    throw new InternalServerErrorException("Failed to delete related questions for module.");
  }

  // Step 5: Delete the module itself
  await this.moduleModel.findByIdAndDelete(moduleId).exec();

  return { message: "Module and its related data deleted successfully" };
}


}
