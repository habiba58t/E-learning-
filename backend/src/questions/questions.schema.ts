import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// The Question schema
@Schema()
export class Question {
  @Prop({ required: true, unique: true })
  keywordTitle: string;

  @Prop({ required: true, unique: true })
  question_text: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty_level: string;

  @Prop({ required: true })
  correct_answer: string; // Example: 'B'

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true, enum: ['mcq', 't/f', 'both'] })
  type: string;

  @Prop({ required: false, type: [String] })
  options: string[]; // Example: ['Option A', 'Option B', 'Option C', 'Option D']
}


// Create the schema
export const QuestionsSchema = SchemaFactory.createForClass(Question);

// Define the hydrated document type for `Question`
export type QuestionsDocument = mongoose.HydratedDocument<Question>;