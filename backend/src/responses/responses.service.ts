import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Responses } from './responses.schema';
import mongoose from 'mongoose';
import { CreateResponseDto } from './dto/create-response.dto';
import { Users } from 'src/users/users.schema';

@Injectable()
export class ResponsesService {
  constructor(
    @InjectModel(Responses.name) private responsesModel: mongoose.Model<Responses>, 
    @InjectModel(Users.name) private userModel: mongoose.Model<Users> 
  ) {}

  // Get all responses for the admin by quizId
  async findAllByQuizId(quizId: mongoose.Types.ObjectId): Promise<Responses[]> {
    try {
      return await this.responsesModel.find({ 'answers.questionId': quizId }).exec();
    } catch (error) {
      throw new Error(`Error fetching responses for quizId "${quizId}": ${error.message}`);
    }
  }

  // Create a response by the student after clicking submit
  async createAndUpdateUser(responseData: CreateResponseDto, userId: mongoose.Types.ObjectId): Promise<Responses> {
    try {
      // Create and save the response
      const newResponse = new this.responsesModel(responseData);
      const savedResponse = await newResponse.save();

      // Update the user's quizzes array
      await this.userModel.updateOne(
        { _id: userId },
        { $push: { quizzes: savedResponse._id } }
      );

      return savedResponse;
    } catch (error) {
      throw new Error(`Error saving response and updating user: ${error.message}`);
    }
  }
//find by username
  async findByUsername(username: string): Promise<Responses | null> {
    return await this.responsesModel.findOne({ username }).exec();
  }
}
