import { Types } from 'mongoose';

export class CreateThreadDto {
  title: string;
  message: string;
  replies?: Types.ObjectId[];
}
