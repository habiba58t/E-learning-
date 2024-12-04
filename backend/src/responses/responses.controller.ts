import { Controller, Post, Get, Body, Query, Delete, Param, UseGuards } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create-response.dto';
import { FindResponsesDto } from './dto/find-responses.dto';
import { Types } from 'mongoose';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Role, Roles } from 'src/auth/decorators/role.decorator';
import { AuthGuard } from 'src/auth/guards/authentication.guard';


@UseGuards(AuthGuard)
@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  // Endpoint to create a new response
  @Post()
  async createResponse(
    @Body() createResponseDto: CreateResponseDto,
  ): Promise<any> {  // Return type can be adjusted as needed
    return this.responsesService.createResponse(createResponseDto);
  }

  @Get('find/:username') 
  async findResponsesByUsername(
    @Param('username') username: string,
  ): Promise<any> {  // Return type can be adjusted as needed
    return this.responsesService.findResponsesByUsername(username);
  }

 // Endpoint to get responses by username and course code
 @Get('find/:username/:course_code')
 async findResponsesByUsernameAndCourseCode(
   @Param('username') username: string,
   @Param('course_code') course_code: Types.ObjectId,
 ): Promise<any> { // You can adjust the return type to suit your needs
   return this.responsesService.findResponsesByUsernameAndCourseCode(username, course_code);
 }

   // Delete response by username (Only for Admin and Instructor)
 // Endpoint to delete a response by username
 @Delete('delete/:username')
 @UseGuards(AuthorizationGuard) // Additional guard for authorization
 @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
 async deleteResponseByUsername(
   @Param('username') username: string,
 ): Promise<{ message: string }> {
   return this.responsesService.deleteResponseByUsername(username);
 }

}