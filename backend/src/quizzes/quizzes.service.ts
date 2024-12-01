import { Injectable } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from './quizzes.schema';

@Injectable()

export class QuizzesService {
 
  
  
  // create(createQuizDto: CreateQuizDto) {
  //   return 'This action adds a new quiz';
  // }

  // findAll() {
  //   return `This action returns all quizzes`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} quiz`;
  // }

  // update(id: number, updateQuizDto: UpdateQuizDto) {
  //   return `This action updates a #${id} quiz`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} quiz`;
  // }
}
