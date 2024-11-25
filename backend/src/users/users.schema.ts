import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Courses } from '../courses/courses.schema'; // Adjust path as necessary



@Schema()
export class Users {

  @Prop({ required: true })
  name: string; 

  @Prop({ required: true, unique: true })
  Username: string; 

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
  courses: Courses[]; // An array of courses the user is associated with
}

export const UsersSchema = SchemaFactory.createForClass(Users);
