import { Injectable, UseGuards,Inject,forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionsDocument } from './questions.schema';
import mongoose, { mongo, Types } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ModulesService } from '../modules/modules.service'; // Corrected import path
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Module, moduleDocument } from 'src/modules/modules.schema';
import { Quiz, QuizzesDocument } from 'src/quizzes/quizzes.schema';
import { QuizzesService } from 'src/quizzes/quizzes.service';


//addQuestionToModule


@Injectable()
//all the questions apis require authenticatation
//and authorization of role admin or instructor
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)

export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: mongoose.Model<QuestionsDocument>,
    @InjectModel(Module.name) private moduleModel: mongoose.Model<moduleDocument>,
    @InjectModel (Quiz.name) private quizModel :mongoose.Model<QuizzesDocument>,
    @Inject(forwardRef(() => ModulesService)) private readonly moduleService: ModulesService,
    @Inject(forwardRef(() => QuizzesService)) private readonly quizService: QuizzesService,
    

  ) {}

//  Create a question and add it to a module's quiz array (only for instructors)
async create(
  username: string,
  questionData: CreateQuestionDto, 
  moduleId: mongoose.Types.ObjectId, 
): Promise<QuestionsDocument> {
  // Create the new question object with data from `questionData` and the `created_by` field
  const newQuestion = new this.questionModel({
    ...questionData, // Spread the data into the new question object
    created_by: username, // Add the creator's username
  });

  // Save the question to the database
  await newQuestion.save();

  // Add the question's ID to the module's quiz array
  await this.moduleService.addQuestionToModule(moduleId, newQuestion._id);

  return newQuestion; // Return the saved question document
}

  async findAllByCreator(username: string): Promise<QuestionsDocument[]> {
    return this.questionModel.find({ created_by: username }).exec();
  }


  // Get all questions for a specific module (accessible by instructors and admins)
    async findAllByModuleId(moduleId: mongoose.Types.ObjectId): Promise<QuestionsDocument[]> {
    const module = await this.moduleModel.findOne(moduleId); // Get the module by ID
    if (!module) {
      throw new Error('Module not found');
    }

    // Retrieve questions where the module ID is in the module's quiz array
    const questions = await this.questionModel.find({
      _id: { $in: module.quizzes },
    }).exec();

    return questions; // Return an array of documents (type `QuestionsDocument[]`)
  }

  // Find a question by difficulty level (accessible by instructors and admins)
    async findOneByDifficulty(difficulty_level: string): Promise<QuestionsDocument | null> {
    const question = await this.questionModel.findOne({ difficulty_level }).exec();
    return question; // Return a document or null (type `QuestionsDocument | null`)
  }

  // Find a question by keyword (accessible by instructors and admins)
  async findOneByKeyword(keywordTitle: string): Promise<QuestionsDocument | null> {
    const question = await this.questionModel.findOne({keywordTitle}).exec();
    return question; // Return a document or null (type `QuestionsDocument | null`)
  }

  // Update a question by its ID (only for instructors and admins)
    async update(id: mongoose.Types.ObjectId, updateQuestionDto: UpdateQuestionDto): Promise<QuestionsDocument | null> {
    const updatedQuestion = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
    return updatedQuestion; // Return the updated document (type `QuestionsDocument | null`)
  }

  // Delete a question by its ID (only for instructors and admins)
    // Delete a question by its ID
    //delete the question from the array of modules
    //warning: cannot delete a question if it exists in the module's quiz
    //if it exists, return "you can't delete the quesion as it exists in a quiz"
    //instructor would have to delete quiz, delete quiestion, then create new quiz
    async delete(id: mongoose.Types.ObjectId): Promise<QuestionsDocument | { message: string }> {
      // Step 1: Find modules containing quizzes that reference the question
      const modulesWithQuizzes: moduleDocument[] = await this.moduleModel
        .find({ quizzes: { $exists: true, $ne: [] } }) // Get modules with quizzes
        .populate({
          path: 'quizzes',
          select: 'questions',  // Only retrieve the `questions` field
        })
        .exec();
    
      // Step 2: Check if the question ID exists in any quiz's questions array
      for (const module of modulesWithQuizzes) {
        for (const quiz of module.quizzes) {
          try {
            const populatedQuiz = await this.quizService.getQuizByQuizId(quiz._id);  // Await the quiz fetching
            if (populatedQuiz.questions.includes(id)) {
              return { message: "You can't delete the question as it exists in a quiz. Please delete the quiz first." };
            }
          } catch (error) {
            throw new Error(`Failed to fetch quiz with ID ${quiz._id}: ${error.message}`);
          }
        }
      }
    
      // Step 3: Proceed to delete the question if not found in any quiz
      const deletedQuestion = await this.questionModel.findByIdAndDelete(id).exec();
      if (!deletedQuestion) {
        throw new Error('Question not found');
      }
    
      return deletedQuestion;
    }
    

}