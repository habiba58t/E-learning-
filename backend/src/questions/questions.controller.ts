import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import mongoose, { Types } from 'mongoose';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Question, QuestionsDocument } from './questions.schema';

@Controller('questions')

@UseGuards(AuthGuard, AuthorizationGuard)
@Roles(Role.Admin, Role.Instructor)

export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Get all questions created by a specific user (username from query parameter)
  @Get(':username')
  async findAllByCreator(@Param('username') username: string): Promise<QuestionsDocument[]> {
    if (!username) {
      throw new Error('Username is required');
    }
    return await this.questionsService.findAllByCreator(username);
  }

  @Post(':username/:moduleId')
  async create(
    @Param('moduleId') moduleId: string,
    @Param('username') username: string,
    @Body() createQuestionDto: CreateQuestionDto
  ) {
    const moduleObjectId = new Types.ObjectId(moduleId);
    return await this.questionsService.create(username, createQuestionDto, moduleObjectId);
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
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    const qid = new Types.ObjectId(id);
    let updateq = await this.questionsService.update(qid, updateQuestionDto);
    return updateq;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const qid = new Types.ObjectId(id);
    return this.questionsService.delete(qid);
  }
}