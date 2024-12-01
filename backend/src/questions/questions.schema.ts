import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// The Question schema
@Schema()
export class Question {
  @Prop({ required: true, unique: true })
  question_text: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty_level: string;

  @Prop({ required: true })
  correct_answer: string;

  @Prop({required:true, enum: ['mcq', 't/f', 'both']})
  type:string;
}

// Create the schema
export const QuestionsSchema = SchemaFactory.createForClass(Question);

// Define the hydrated document type for `Question`
export type QuestionsDocument = mongoose.HydratedDocument<Question>;
