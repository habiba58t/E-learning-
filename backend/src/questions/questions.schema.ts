import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Question extends Document {
  @Prop({ required: true, unique: true })
  question_id: string;

  @Prop({ required: true, unique: true })
  question_text: string;

  @Prop({ required: true, enum: ['mcq', 'tf', 'complete'] })
  question_type: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  difficulty_level: string;

  @Prop({ required: true })
  module_id: string;
}

export const QuestionsSchema = SchemaFactory.createForClass(Question);
