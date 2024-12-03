import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Module } from '../modules/modules.schema';
import { ForumThread } from '/Users/ialiaaah/Desktop/swwwww/E-learning-/backend/src/forum/forum/forum.schema';

export type CoursesDocument = Courses & Document;

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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }] })
  modules: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumThread' }] })
  threads: mongoose.Schema.Types.ObjectId[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
