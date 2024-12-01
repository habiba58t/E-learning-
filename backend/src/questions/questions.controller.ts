import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import mongoose from 'mongoose';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(@Param('moduleId') moduleId: mongoose.Types.ObjectId, @Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.create(createQuestionDto, moduleId);
  }


  @Get(':difficulty_level')
  async findOne(@Param('difficulty_level') difficulty_level: string) {
      return await this.questionsService.findOne(difficulty_level);
  }
  
  @Patch(':id')
  async update(@Param('id') id: mongoose.Types.ObjectId, @Body() updateQuestionDto: UpdateQuestionDto) {
    let updateq = await this.questionsService.update(id, updateQuestionDto);
    return updateq;
  }

  @Delete(':id')
  async delete(@Param('id') id: mongoose.Types.ObjectId) {
    return this.questionsService.delete(id);
  }
}
