import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import mongoose from 'mongoose';

@Controller('responses')
export class ResponsesController {
constructor(private readonly responsesService:ResponsesService){}

@Get('quiz/:quizId')
async findAllResponsesByQuizId(@Param('quizId') quizId: string) {
  try {
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      throw new NotFoundException(`Invalid quizId: "${quizId}".`);
    }

    const responses = await this.responsesService.findAllByQuizId(new mongoose.Types.ObjectId(quizId));
    if (!responses.length) {
      throw new NotFoundException(`No responses found for quizId "${quizId}".`);
    }

    return {
      message: 'Responses retrieved successfully',
      data: responses,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch responses', error.message);
  }

}

@Get(':username')
async findByUsername(@Param('username') username: string) {
  const response = await this.responsesService.findByUsername(username);
  if (!response) {
    throw new NotFoundException(`Response for username "${username}" not found.`);
  }
  return response;
}


@Post(':userId')  // Expecting userId in the URL path
async createAndUpdateUser(
  @Param('userId') userId: string, // Getting userId from route parameters
  @Body() createResponse: CreateResponseDto
) {
  try {
    // Convert userId to mongoose.Types.ObjectId if necessary
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Call the service method and pass both the response data and userId
    const createdResponse = await this.responsesService.createAndUpdateUser(createResponse, userObjectId);

    return {
      message: 'Response created successfully',
      data: createdResponse,
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to create response', error.message);
  }
}



}
