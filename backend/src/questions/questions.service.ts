import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionsDocument } from './questions.schema';
import mongoose from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ModulesService } from '../modules/modules.service'; // Corrected import path
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Module, moduleDocument } from 'src/modules/modules.schema';

@Injectable()
//all the questions apis require authenticatation
//and authorization of role admin or instructor
@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)

export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: mongoose.Model<QuestionsDocument>,
    @InjectModel(Module.name) private moduleModel: mongoose.Model<moduleDocument>,

    private readonly moduleService: ModulesService // Inject ModulesService
  ) {}

  // Create a question and add it to a module's quiz array (only for instructors)

  async create(questionData: CreateQuestionDto, moduleId: mongoose.Types.ObjectId): Promise<QuestionsDocument> {
    const newQuestion = new this.questionModel(questionData);
    
    // Save the question first
    await newQuestion.save();

    // Add question ID to the module's quiz array via the ModuleService
    await this.moduleService.addQuestionToModule(moduleId, newQuestion._id);

    return newQuestion; // Return the saved document (of type `QuestionsDocument`)
  }

  // Get all questions for a specific module (accessible by instructors and admins)
    async findAllByModuleId(moduleId: mongoose.Types.ObjectId): Promise<QuestionsDocument[]> {
    const module = await this.moduleService.findOne(moduleId); // Get the module by ID
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
    async findOne(difficulty_level: string): Promise<QuestionsDocument | null> {
    const question = await this.questionModel.findOne({ difficulty_level }).exec();
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
  const modulesWithQuizzes = await this.moduleModel
    .find({ quizzes: { $exists: true, $ne: [] } }) // Get modules with quizzes
    .populate({
      path: 'quizzes',
      select: 'questions', // Only retrieve the `questions` field
    })
    .exec();

  // Step 2: Check if the question ID exists in any quiz's questions array
  for (const module of modulesWithQuizzes) {
    for (const quiz of module.quizzes) {
      if (quiz.questions.includes(id)) {
        return { message: "You can't delete the question as it exists in a quiz. Please delete the quiz first." };
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
