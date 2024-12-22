import { Injectable, NotFoundException, Inject, forwardRef, UseGuards } from '@nestjs/common';
import { Controller, Delete, Param,  InternalServerErrorException,UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module} from './modules.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Quiz, QuizzesDocument } from '../quizzes/quizzes.schema';
import { CreateModuleDto } from './dto/CreateModule.dto';
import { UpdateModuleDto } from './dto/UpdateModule.dto';
import { QuizzesService } from '../quizzes/quizzes.service';
import {Question, QuestionsDocument} from '../questions/questions.schema'
import { QuestionsService } from 'src/questions/questions.service';
import { Notes } from 'src/notes/notes.schema';
import { NotesService } from 'src/notes/notes.service';
import { moduleDocument } from './modules.schema';
import { Content } from 'src/content/content.schema';
import { ContentService } from 'src/content/content.service';
import { contentDocument } from 'src/content/content.schema';

//import {quizDocument} from 'src/quizzes/quizzes.service'
//import { QqestionsDocument } from 'src/questions/questions.schema';
import { CoursesService } from 'src/courses/courses.service';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.schema';
import { userDocument} from 'src/users/users.schema';
import { notesDocument } from 'src/notes/notes.schema';
import { StudentService} from 'src/users/student/student.service';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Role, Roles } from '../auth/decorators/role.decorator';

@Injectable()
@UseGuards(AuthGuard) // Apply AuthGuard globally to all methods in modules

export class ModulesService {
  constructor(
   // @InjectModel(Module.name) private moduleModel: Model<Module>,
    @InjectModel(Module.name) private readonly moduleModel: Model<moduleDocument>,
    @InjectModel(Content.name) private readonly contentModel: Model<contentDocument>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
    @InjectModel(Users.name) private readonly usersModel: Model<userDocument>,
    @InjectModel(Notes.name) private readonly notesModel: Model<notesDocument>,
    @Inject(forwardRef(() => QuizzesService)) private readonly quizzesService: QuizzesService,
    @Inject(forwardRef(() => QuestionsService)) private readonly questionsService: QuestionsService,
    @Inject(forwardRef(() => NotesService)) private readonly notesService: NotesService, // Inject ModulesService with forwardRef
    @Inject(forwardRef(() => ContentService)) private readonly contentService: ContentService, 
    @Inject(forwardRef(() => CoursesService)) private readonly coursesService: CoursesService, 
    @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService, 
    @Inject(forwardRef(() => StudentService)) private readonly studentService: StudentService, 
  ) {}

  //find all modules is for admin only? since student only sees for enrolled
  //courses and intructor sees for the courses they teach
  
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin, Role.Instructor)
    async findAll(): Promise<moduleDocument[]> {
        return this.moduleModel.find().exec();
      }

//get module by id for courses
      async findById(moduleId: mongoose.Types.ObjectId): Promise<moduleDocument> {
        const module = await this.moduleModel.findById(moduleId).exec();
        if (!module) {
          throw new NotFoundException(`Module with Object id ${moduleId} not found`);
        }
        return module;
      }
 //get module by title 
 async findByTitle(title: string): Promise<moduleDocument> {
  console.log("Searching for module with title:", title);
  const module = await this.moduleModel.findOne({ title });
  if (!module) {
    console.log("Module not found for title:", title);
    return null;
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
async update(titleM: string, updateModuleDto: UpdateModuleDto,username:string): Promise<moduleDocument> {
  const user = await this.usersService.findUserByUsername(username);
  const module = await this.moduleModel.findOne({title:titleM}).exec();
        if (!module) {
          throw new NotFoundException(`Module with title ${titleM} not found`);
  }
  console.log("module",module);
  console.log("dto",updateModuleDto);
  // check if instructor who i updated is the one who created 
  const course = await this.coursesService.findCourseByModuleId(module._id)

  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  }
  const updatedModule = await this.moduleModel.findOneAndUpdate({title:titleM},updateModuleDto ,{ new: true });
  if (!updatedModule) {
    throw new NotFoundException(`not updated ${updatedModule} not found`);
  }
  return updatedModule;
}

// Delete a module by title
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin, Role.Instructor)
async delete(title: string): Promise<moduleDocument> {
  const deletedModule = await this.moduleModel.findOneAndDelete({title}).exec();
  if (!deletedModule) {
    throw new NotFoundException(`Module with title ${title} not found`);
  }
  return deletedModule;
}

//implemented by farah for use in quiz
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
//implemented by farah for use in quiz
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
//implemented by farah for use in quiz
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
async findModuleByQuizId(quizId: string): Promise<moduleDocument>{
  const qid = new mongoose.Types.ObjectId(quizId)
  const module = await this.moduleModel.findOne({quizzes: {$in: [qid]}})
  return module;
}


// Add question to modules array
async addQuestionToModule(moduleId: mongoose.Types.ObjectId, questionId: mongoose.Types.ObjectId): Promise<moduleDocument> {
  // Find the module by ID
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new NotFoundException(`Module with ID ${moduleId} not found.`);
  }

  const course = await this.coursesService.findCourseByModuleId(module._id)

  // const isInstructor = course.created_by === user.username;
  // const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  // if (!isInstructor && !isAdmin) {
  //   throw new UnauthorizedException('You are not authorized to add quiz to module');
  // }

  // Check if the quiz is already in the array
  if (module.quizzes.some((existingQuizId) => existingQuizId.equals(questionId))) {
    throw new Error('Quiz is already added to this module.');
  }

  // Add the quiz ID to the array
  module.quizzes.push(questionId);

  // Save the updated module
  await module.save();

  return module;
}

//get all quizzes of module by module objectid
async getQuizzesForModule(ObjectId: mongoose.Types.ObjectId): Promise<QuizzesDocument[]> {
  const module = await this.findById(ObjectId);

  if (!module) {
    throw new NotFoundException(`module with code ${ObjectId} not found`);
  }


  // Fetch all modules by their ObjectIds
  const quizzes = await this.quizModel.find({
    _id: { $in: module.quizzes }, // Match ObjectIds in `course.modules`
  }).exec();

  return quizzes;
}

//get all questions of module by module objectid
//@UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
async getQuestionsForModule(ObjectId: mongoose.Types.ObjectId,user:any): Promise<QuestionsDocument[]> {
  const course = await this.coursesService.findCourseByModuleId(ObjectId)

  if (!course) {
    throw new NotFoundException(`course with code ${ObjectId} not found`);
  }

  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  }

  const module = await this.findById(ObjectId);
  if (!module) {
    throw new NotFoundException(`module with code ${ObjectId} not found`);
  }

  // Fetch all modules by their ObjectIds
  const questions = await this.questionModel.find({
    _id: { $in: module.questions }, // Match ObjectIds in `course.modules`
  }).exec();

  return questions;
}


// Add quiz to modules array
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
async addQuizToModule(moduleId: mongoose.Types.ObjectId, quizId: mongoose.Types.ObjectId,user:any): Promise<moduleDocument> {
  // Find the module by ID
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new NotFoundException(`Module with ID ${moduleId} not found.`);
  }
const course = await this.coursesService.findCourseByModuleId(moduleId)
  if (!course) {
    throw new NotFoundException(`course with code ${moduleId} not found`);
  }

  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  }

  // Check if the quiz is already in the array
  if (module.quizzes.some((existingQuizId) => existingQuizId.equals(quizId))) {
    throw new Error('Quiz is already added to this module.');
  }

  // Add the quiz ID to the array
  module.quizzes.push(quizId);

  // Save the updated module
  await module.save();

  return module;
}

//GET: find module outdated attribute by course code
// @UseGuards(AuthorizationGuard)
// @Roles(Role.Admin,Role.Instructor)
async findOutdated(title: string): Promise<boolean> {
  const module = await this.moduleModel.findOne({ title }, { isOutdated: 1, _id: 0 }) 
  if (!module) {
    throw new NotFoundException(`Course with module ${title} not found`);
  }

  return module.isOutdated;
}

//PUT: change outdated of module
async toggleOutdated(title: string,username:string): Promise<moduleDocument> {
  const user= await this.usersService.findUserByUsername(username);
  const module = await this.moduleModel.findOne({ title }).exec();
  if (!module) {
    throw new NotFoundException(`Course with module ${title} not found`);
  }

  const course = await this.coursesService.findCourseByModuleId(module._id)
  if (!course) {
    throw new NotFoundException(`course with code ${module._id} not found`);
  }

  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to view questions of this module');
  }

  module.isOutdated = !module.isOutdated;
  return await module.save();
}

// Method to add file metadata to a Module's resources
async addContentToModule(moduleId: string,fileUrl: string,originalName: string,fileType: string,contentTitle: string,username: string,
): Promise<moduleDocument> {
  try {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }
    console.log(`Module with ID ${moduleId}`, module);

    const course = await this.coursesService.findCourseByModuleId(module._id);
    if (!course) {
      throw new NotFoundException(`Course with ID ${module._id} not found.`);
    }

    const user = await this.usersService.findUserByUsername(username);
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found.`);
    }

    const isInstructor = course.created_by === user.username;
    const isAdmin = user.role === 'admin';

    if (!isInstructor && !isAdmin) {
      throw new UnauthorizedException(
        'You are not authorized to upload files to this module.',
      );
    }

    // File metadata
    const fileMetadata = {
      filePath: fileUrl,
      fileType: fileType,
      originalName: originalName,
    };

    // Content DTO
    const contentDto = {
      title: contentTitle,
      resources: [fileMetadata],
    };
    

    const content = await this.contentService.createContent(contentDto);
    if (!content) {
      throw new InternalServerErrorException('Failed to create content.');
    }

    // Add content ID to the module
    module.content.push(content._id);

    // Save the updated module
    await module.save();
    return module;
  } catch (error) {
    console.error('Error in addContentToModule service:', error);
    throw new InternalServerErrorException('Failed to update the module.');
  }
}


//get content for a speicifc module
async getContentForModule( username: string, title: string): Promise<Content[]> {
  const module = await this.moduleModel.findOne({title}).exec();
  if (!module) {
    throw new NotFoundException(`Module with title ${title} not found`);
  }
  const course = await this.coursesService.findCourseByModuleId(module._id)
  if (!course) {
    throw new NotFoundException(`course with code ${module._id} not found`);
  }
  // const user = await this.usersService.findUserByUsername(username);
  // const isInstructor = course.created_by === user.username;
  // const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  // if (!isInstructor && !isAdmin) {
  //   throw new UnauthorizedException('You are not authorized to upload files to this module');
  // }

  const contentIds= module.content;
  if (!contentIds || contentIds.length === 0) {
    console.log("empty", contentIds);
    return []; // Return an empty array if no content IDs are provided
  }
  console.log("not empty", contentIds);

  try {
    // Use Promise.all to resolve all async calls
    const contents = await Promise.all(
      contentIds.map(async (id) => {
        const content = await this.contentService.findById(id);
        console.log("content:", content);
        if (!content) {
          throw new NotFoundException(`Content with ID ${id} not found`);
        }
        return content; // Return the content object
      })
    );

    return contents; // Return the resolved array of contents
  } catch (error) {
    console.error("Error fetching contents:", error);
    throw new InternalServerErrorException("Failed to retrieve contents");
  }
}
// delete module and all related quizzes and questions 
async deleteModule(moduleId: mongoose.Types.ObjectId,username:string): Promise<any> {
  // Step 1: Find the module to delete
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new NotFoundException(`Module with ID ${moduleId} not found`);
  }
const course = await this.coursesService.findCourseByModuleId(module._id)
  if (!course) {
    throw new NotFoundException(`course with code ${module._id} not found`);
  }
const user = await this.usersService.findUserByUsername(username);
  const isInstructor = course.created_by === user.username;
  const isAdmin = user.role === 'admin'; // Assuming 'role' is available on the user object

  if (!isInstructor && !isAdmin) {
    throw new UnauthorizedException('You are not authorized to upload files to this module');
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

//GET AVERAGE RATING
async getAverageRating( ObjectId: mongoose.Types.ObjectId): Promise<number> {
  const course = await this.moduleModel.findById(ObjectId);
  return course.averageRating;
 }
 
 //SET RATING,TOTAL,AVERAGE
 async setRating(ObjectId: mongoose.Types.ObjectId,score:number): Promise<void> {
   const module = await this.moduleModel.findById(ObjectId);
   module.totalRating = module.totalRating + score;
   module.totalStudents += 1;
   module.averageRating = module.totalRating/module.totalStudents;
 }

 //GET NOTES FOR A SPECIFIC USER
 async getNotesForUserAndNote(username: string, title: string): Promise<notesDocument[]> {
  // Step 1: Fetch the module by title and decode the title
  const decodedTitle = decodeURIComponent(title);
  const module = await this.findByTitle(decodedTitle);

  if (!module || !module._id) {
    throw new NotFoundException(`Module with title "${title}" not found`);
  }

  // Step 2: Extract note IDs directly from the module if available
  const noteIds = module.notes || []; // Assuming `module.notes` is an array of ObjectIDs
  if (!noteIds || noteIds.length === 0) {
    return []; // No notes found for this module
  }

  // Step 3: Fetch each note by its ID and filter by username
  try {
    // Filtered notes based on the username
    const notes = await Promise.all(
      noteIds.map(async (noteId) => {
        // Fetch the note by its ID
        const noteIdString = noteId.toString();
        const note = await this.notesService.findByIdNote(noteIdString);

        // Check if the note belongs to the specified username
        if (note.username === username) {
          return note; // Return the note only if the username matches
        }

        return null; // Return null if it doesn't match
      })
    );

    // Remove any null entries (non-matching notes)
    return notes.filter((note) => note !== null) as notesDocument[];
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw new InternalServerErrorException('Failed to fetch notes.');
  }
}



// //GET A SPECIFIC NOTE FOR A SPEICIFC MODULE
// // @UseGuards(AuthorizationGuard)
// // @Roles(Role.User)
// async getNoteForUser(notetId: mongoose.Types.ObjectId): Promise<notesDocument>{
//  return await this.notesService.findByIdNote(notetId);
// }

//Delete NOTE FOR A SPECIFIC NOTE
// @UseGuards(AuthorizationGuard)
// @Roles(Role.User)
async deleteNote(title:string,username:string,notetId: string): Promise<void>{
  const module = await this.findByTitle(title) as moduleDocument;
  if (!module || !module._id) {
    throw new NotFoundException(`Module with title "${title}" not found`);
  }
  const id= new mongoose.Types.ObjectId(notetId)
  const note= await this.notesService.findByIdNote(notetId);
  const student = await this.usersService.findUserByUsername(username);

  if (student.notes.has(module._id)) {
    const noteIds = student.notes.get(module._id);  // Get the array of note IDs for the specified module ID
    if (noteIds) {
      const updatedNoteIds = noteIds.filter(id => !id.equals(note._id)); // Using filter to create a new array without the note ID
      student.notes.set(module._id, updatedNoteIds);  // Set the updated array back to the Map
    }
  }
  await student.save(); 

  await this.notesService.deleteNote(id);

}


 //CREATE NOTE FOR A SPECIFIC NOTE
//  @UseGuards(AuthorizationGuard)
//  @Roles(Role.User)
//  async createNote(title:string,username:string,content: string): Promise<notesDocument>{
//   const course = await this.coursesService.getCourseForModule(title);
//   const module= await this.findByTitle(title) as moduleDocument;

//   const notesDto = {
//     username: username, 
//     course_code: course.course_code,
//     content: content,
//   };
//   const note = await this.notesService.createNote(notesDto) as notesDocument;
//   const user = await this.usersService.findUserByUsername(username);
//   user.notes.get(module._id)?.push(note._id);
//   await user.save();
//   return note;
//  }

 //UPDATE NOTE FOR A SPECIFIC NOTE
//  @UseGuards(AuthorizationGuard)
//  @Roles(Role.User)
async UpdateNote(notetId: mongoose.Types.ObjectId,contentNew:string): Promise<notesDocument>{
  const notesDto = {
    content:contentNew,
  };
 const note= await this.notesService.updateNote(notetId, notesDto);
  return note;
}

 //toggle notes enable
    async toggleNote(moduleTitle: string): Promise<void> {
       const module = await this.moduleModel.findOne({title:moduleTitle});
       module.enableNotes = !module.enableNotes;
        await module.save();

    } 
}
