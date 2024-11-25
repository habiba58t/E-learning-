import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './questions.schema';
import mongoose from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {

  constructor(
    @InjectModel(Question.name) private questionModel: mongoose.Model<Question>
) { }
  async create(questionData:CreateQuestionDto):Promise<Question>{
    const newQuestion = new this.questionModel(questionData);
    return await newQuestion.save();
  }

async findAll():Promise<Question[]>{
let questions = await this.questionModel.find();
return questions;
}

async findOne(difficulty_level: string): Promise<Question> {
  const question = await this.questionModel.findOne({ difficulty_level });
  return question;
}


  async update(id: mongoose.Types.ObjectId, updateQuestionDto: UpdateQuestionDto):Promise<Question> {
    return await this.questionModel.findByIdAndUpdate(id);
  }

  async delete(id: mongoose.Types.ObjectId): Promise<Question | null> {
    return await this.questionModel.findByIdAndDelete(id);
}

}
