import { Controller, Post, Get, Body, Query, Delete, Param } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { FindResponsesDto } from './dto/find-responses.dto';
import { Types } from 'mongoose';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Post()
  async createResponse(@Body() createResponseDto: CreateResponseDto) {
    return this.responsesService.createResponse(createResponseDto);
  }

  @Get('/by-username')
  async findResponsesByUsername(@Query('username') username: string) {
    return this.responsesService.findResponsesByUsername(new Types.ObjectId(username));
  }

  @Get('/by-username-and-course')
  async findResponsesByUsernameAndCourseCode(
    @Query() query: FindResponsesDto,
  ) {
    const { username, course_code } = query;
    return this.responsesService.findResponsesByUsernameAndCourseCode(
      new Types.ObjectId(username),
      new Types.ObjectId(course_code),
    );
  }

   // Delete response by ID
   @Delete(':id')
   async deleteResponse(@Param('id') id: string) {
     const responseId = new Types.ObjectId(id);  // Convert the string id to ObjectId
     return this.responsesService.deleteResponse(responseId);
   }

}
