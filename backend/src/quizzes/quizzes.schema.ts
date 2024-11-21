import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Question } from '../questions/questions.schema'; // Import Question schema

@Schema()
export class Quiz extends Document {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    required: true,
  }) // Reference to Question schema using ObjectId
  questions: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: Date.now }) // Automatically set to the current date/time
  created_at: Date;
}

export const QuizzesSchema = SchemaFactory.createForClass(Quiz);
