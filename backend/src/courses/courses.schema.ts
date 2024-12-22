import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document,Types } from 'mongoose';
import * as mongoose from 'mongoose'; // Import mongoose to use ObjectId
import { Module } from '../modules/modules.schema'; // Correct import for the Module schema
import { HydratedDocument } from 'mongoose';

export type courseDocument = HydratedDocument<Courses>
@Schema()
export class Courses  {
  @Prop({ required: true, unique: true })
  course_code: string;

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string; 

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  level: string; 

  @Prop({ required: true })
  created_by: string;

  @Prop()
  created_at: Date; 

  @Prop({default: false})
  Unavailable: boolean;

  // Reference to Module documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }] ,default: [] })
modules: mongoose.Types.ObjectId[]; // Store ObjectId references

    @Prop({default: 0})
totalRating: number; //sum of ratings for course

@Prop({default: 0})
totalStudents: number; //number of students who voted for course

@Prop({default: 0})
averageRating: number; 

  @Prop({default: false})
  isOutdated: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threads' }] ,default: [] })
threads: mongoose.Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);