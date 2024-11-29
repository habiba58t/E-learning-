import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
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
  password_hash: string; 

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string; 

  @Prop({ required: false })
  picture_url: string; 

  @Prop({ required: true })
  created_at: Date; 

  // Reference to Courses by ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }] })
  courses: mongoose.Types.ObjectId[]; // An array of courses the user is associated with

  @Prop({ required: true })
  totalRating: number; //sum of ratings for intructor                  //INSTRUCTOR Attribute only
  
  @Prop({ required: true })
  totalStudents: number; //number of students who voted for intructor       ///INSTRUCTOR Attribute only

  @Prop({ required: true })
  studentScore: number; //student score in number                      //STUDENT Attribute only
  
  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  studentLevel: string;                                               //STUDENT Attribute only
}

export const UsersSchema = SchemaFactory.createForClass(Users);
