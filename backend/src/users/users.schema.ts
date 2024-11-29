import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Courses } from '../courses/courses.schema'; // Adjust path as necessary

export type UserDocument = Document & Users;

@Schema()
export class Users {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string; // Changed to lowercase for consistency

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string; // Changed to camelCase

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string;

  @Prop()
  pictureUrl?: string; // Changed to camelCase and made optional

  @Prop({ required: true, default: Date.now }) // Set default to the current date
  createdAt: Date; // Changed to camelCase

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Courses' }] })
  courses: Types.ObjectId[]; // Use ObjectId array to align with Mongoose references
}

export const UsersSchema = SchemaFactory.createForClass(Users);
