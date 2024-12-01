import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Responses, ResponsesDocument } from './responses.schema';
import { CreateResponseDto } from './dto/create-response.dto';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { AuthGuard } from 'src/auth/guards/authentication.guard';  
import { Role } from 'src/auth/decorators/role.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';


@UseGuards(AuthGuard) // Apply AuthGuard globally to all methods
@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Responses.name) private readonly responsesModel: Model<ResponsesDocument>,
  ) {}
 //add reponse to array of quizzes but already done in quizzes
  async createResponse(createResponseDto: CreateResponseDto): Promise<ResponsesDocument> {
    const newResponse = new this.responsesModel(createResponseDto);
    return newResponse.save();
  }

  async findResponsesByUsername(username: string): Promise<ResponsesDocument[]> {
    return this.responsesModel.find({ username }).exec();
  }
  //get all responses of a user, average them all to get
  //cumulative gpa

  //for student report to get all the responses
  //for all modules for a certain course a student takes,
  //call an api to get all courses of a student and each call
  //this to display all courses and for each take average
  //score accross all scores in the module
  //also call getProgressByCourseCode to get completion % for 
  //that particular course
  async findResponsesByUsernameAndCourseCode(
    username: string,
    course_code: Types.ObjectId,
  ): Promise<ResponsesDocument[]> {
    return this.responsesModel.find({ username, course_code }).exec();
  }

  // Delete response by ID
  //when u delete a reponse, do it by username
  @UseGuards(AuthorizationGuard) // Additional guard for authorization
  @Roles(Role.Admin, Role.Instructor) // Restrict roles to admin and instructor
  async deleteResponseByUsername(username: string): Promise<{ message: string }> {
    const deletedResponse = await this.responsesModel.findByIdAndDelete(username);
    if (!deletedResponse) {
      throw new Error('No responses found for this user');
    }
    return { message: 'Response deleted successfully' };
  }
}
