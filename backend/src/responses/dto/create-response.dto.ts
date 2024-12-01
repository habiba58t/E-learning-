import mongoose from "mongoose";
import { IsNotEmpty, IsArray, IsMongoId, IsNumber } from 'class-validator';

export class CreateResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  username: string; // MongoDB ObjectId of the user

  @IsMongoId()
  @IsNotEmpty()
  course_code: string; // MongoDB ObjectId of the course

  @IsArray()
  @IsNotEmpty()
  answers: { questionId: string; answer: string }[]; // Array of answers with questionId

  @IsNumber()
  @IsNotEmpty()
  score: number;
}
