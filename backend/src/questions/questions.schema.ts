import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question {
  @Prop({ required: true, unique: true })
  question_text: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty_level: string;

  @Prop({ required: true })
  correct_answer: string;

  @Prop({required:true})
  type:string;
}

export const QuestionsSchema = SchemaFactory.createForClass(Question);
