import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Courses } from '../courses/courses.schema'; // Adjust path as necessary
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<Users>
@Schema()
export class Users {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string; 

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

  // Reference to Courses by ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }] })
  courses: mongoose.Types.ObjectId[]; // An array of courses the user is associated with

  @Prop({ required: true })
  totalRating: number; //sum of ratings for intructor                  //INSTRUCTOR Attribute only
  
  @Prop({ required: true })
  totalStudents: number; //number of students who voted for intructor       ///INSTRUCTOR Attribute only

  @Prop({
    type: Map,
    of: Number,
    required: true,
  })
  studentScore: Map<mongoose.Types.ObjectId, number>; // Map of ObjectId to number

  @Prop({
    type: Map,
    of: String,
    enum: ['easy', 'medium', 'hard'], // Enforce enum values
    required: true,
  })
  studentLevel: Map<mongoose.Types.ObjectId, string>; // Map of ObjectId to string (enum)
}

export const UsersSchema = SchemaFactory.createForClass(Users);
