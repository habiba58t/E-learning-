import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import mongoose from 'mongoose';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';

@Controller('questions')

@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)

export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(@Param('moduleId') moduleId: mongoose.Types.ObjectId, @Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.create(createQuestionDto, moduleId);
  }

//for search purpose, instructor can find a question by difficulty or 
//keyword/title that they add when creating the question
  @Get(':difficulty_level')
  async findOneByDifficulty(@Param('difficulty_level') difficulty_level: string) {
      return await this.questionsService.findOneByDifficulty(difficulty_level);
  }
  @Get(':keyword')
  async findOneByKeyword(@Param('keywordTitle') keywordTitle: string) {
      return await this.questionsService.findOneByDifficulty(keywordTitle);
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