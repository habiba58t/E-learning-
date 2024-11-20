import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {Courses} from '../courses/courses.schema';

export type UsersDocument = Users & Document;

@Schema()
export class Users {

  @Prop({ required: true})
  name: string; 

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

  @Prop({ type: [{ type:mongoose.Schema.Types.ObjectId, ref: 'courses' }] })
  courses: Courses[];
}

export const UsersSchema = SchemaFactory.createForClass(Users);
