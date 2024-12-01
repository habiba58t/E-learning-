import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Responses, ResponsesDocument } from './responses.schema';
import { CreateResponseDto } from './dto/create-response.dto';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Responses.name) private readonly responsesModel: Model<ResponsesDocument>,
  ) {}

  async createResponse(createResponseDto: CreateResponseDto): Promise<ResponsesDocument> {
    const newResponse = new this.responsesModel(createResponseDto);
    return newResponse.save();
  }

  async findResponsesByUsername(username: Types.ObjectId): Promise<ResponsesDocument[]> {
    return this.responsesModel.find({ username }).exec();
  }

  async findResponsesByUsernameAndCourseCode(
    username: Types.ObjectId,
    course_code: Types.ObjectId,
  ): Promise<ResponsesDocument[]> {
    return this.responsesModel.find({ username, course_code }).exec();
  }

  // Delete response by ID
  async deleteResponse(responseId: mongoose.Types.ObjectId): Promise<{ message: string }> {
    const deletedResponse = await this.responsesModel.findByIdAndDelete(responseId);
    if (!deletedResponse) {
      throw new Error('Response not found');
    }
    return { message: 'Response deleted successfully' };
  }
}
