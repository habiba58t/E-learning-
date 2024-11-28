import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import mongoose from 'mongoose';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto) {
    const { no_of_questions, types_of_questions } = createQuizDto;
    const quiz = await this.quizzesService.generateQuiz(no_of_questions, types_of_questions);
    return quiz; // Return the generated quiz
  }

  @Get()
  async findAll() {
    return await this.quizzesService.findAll();
  }

  // Get quiz for student (questions only)
  @Get(':id/student')
  async findOneForStudent(@Param('id') id: mongoose.Types.ObjectId) {
    return await this.quizzesService.findQuizWithQuestions(id);
  }

  // Get quiz for instructor (questions and responses)
  @Get(':id/instructor')
  async findOneForInstructor(@Param('id') id: mongoose.Types.ObjectId) {
    return await this.quizzesService.findQuizWithQuestionsAndResponses(id);
  }

  @Patch(':id')
  async update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateQuizDto: UpdateQuizDto) {
    return await this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: mongoose.Types.ObjectId) {
    return await this.quizzesService.delete(id);
  }
}
