import mongoose, { Types } from 'mongoose';

export class CreateThreadDto {
  courseId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  replies?: Types.ObjectId[];
}
