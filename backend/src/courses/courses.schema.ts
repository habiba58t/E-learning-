import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Module } from '../modules/modules.schema'; // Correct import for the Module schema



@Schema()
export class Courses {
  @Prop({ required: true, unique: true })
  course_code: string;

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  level: string; 

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  created_at: Date; 

  // Reference to Module documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }] })
  modules: mongoose.Schema.Types.ObjectId[];

  
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
