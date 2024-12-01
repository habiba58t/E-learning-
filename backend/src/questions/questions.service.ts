import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionsDocument } from './questions.schema';
import mongoose from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ModulesService } from '../modules/modules.service';  // Corrected import path

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: mongoose.Model<QuestionsDocument>,
    private readonly moduleService: ModulesService  // Inject ModulesService
  ) {}

  // Create a question and add it to a module's quiz array (only for instructors)
  async create(questionData: CreateQuestionDto, moduleId: mongoose.Types.ObjectId): Promise<QuestionsDocument> {
    const newQuestion = new this.questionModel(questionData);
    
    // Save the question first
    await newQuestion.save();

    // Add question ID to the module's quiz array via the ModuleService
    await this.moduleService.addQuestionToModule(moduleId, newQuestion._id);

    return newQuestion;  // Return the saved document (of type `QuestionsDocument`)
  }

  // Get all questions for a specific module
  async findAllByModuleId(moduleId: mongoose.Types.ObjectId): Promise<QuestionsDocument[]> {
    const module = await this.moduleService.findOne(moduleId);  // Get the module by ID
    if (!module) {
      throw new Error('Module not found');
    }

    // Retrieve questions where the module ID is in the module's quiz array
    const questions = await this.questionModel.find({
      _id: { $in: module.quizzes }
    }).exec();

    return questions;  // Return an array of documents (type `QuestionsDocument[]`)
  }

  // Find a question by difficulty level (as an example of a query filter)
  async findOne(difficulty_level: string): Promise<QuestionsDocument | null> {
    const question = await this.questionModel.findOne({ difficulty_level }).exec();
    return question;  // Return a document or null (type `QuestionsDocument | null`)
  }

  // Update a question by its ID
  async update(id: mongoose.Types.ObjectId, updateQuestionDto: UpdateQuestionDto): Promise<QuestionsDocument | null> {
    const updatedQuestion = await this.questionModel.findByIdAndUpdate(id, updateQuestionDto, { new: true }).exec();
    return updatedQuestion;  // Return the updated document (type `QuestionsDocument | null`)
  }

  // Delete a question by its ID
  async delete(id: mongoose.Types.ObjectId): Promise<QuestionsDocument | null> {
    const deletedQuestion = await this.questionModel.findByIdAndDelete(id).exec();
    return deletedQuestion;  // Return the deleted document (type `QuestionsDocument | null`)
  }
}
