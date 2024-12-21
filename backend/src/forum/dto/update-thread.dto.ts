import mongoose, { Types } from 'mongoose';

export class UpdateThreadDto {
  courseId: mongoose.Types.ObjectId;
  title?: string;
  message?: string;

}