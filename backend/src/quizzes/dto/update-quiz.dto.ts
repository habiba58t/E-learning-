import { IsArray, ArrayNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UpdateQuizDto {
  @IsOptional() // Makes the property optional for partial updates
  @IsArray() // Ensures the property is an array
  @ArrayNotEmpty() // Ensures the array is not empty (optional but useful)
  @IsString({ each: true }) // Ensures each element in the array is a string
  responses?: mongoose.Types.ObjectId[];
}
