import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Courses } from '../courses/courses.schema'; // Adjust path as necessary
import { HydratedDocument } from 'mongoose';
import { Notes } from 'src/notes/notes.schema';

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

  @Prop({ type: Map, of: [mongoose.Schema.Types.ObjectId] })
  notes: Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId[]>;  ///STUDENT Attribute only
  
  @Prop({ required: true })
  totalRating: number; //sum of ratings for intructor                  //INSTRUCTOR Attribute only
  
  @Prop({ required: true })
  totalStudents: number; //number of students who voted for intructor       ///INSTRUCTOR Attribute only

  @Prop()                                                                 ///INSTRUCTOR Attribute only
   averageRating: number; 

  @Prop({ type: Map, of: Number, required: true })
  studentScore: Map<mongoose.Types.ObjectId, number>;
  
  @Prop({type: Map,of: String,enum: ['easy', 'medium', 'hard'],})
  studentLevel: Map<mongoose.Types.ObjectId, string>; // Map of ObjectId to string (enum)
}

export const UsersSchema = SchemaFactory.createForClass(Users);
