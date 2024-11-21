import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Question } from '../questions/questions.schema'; // Import Question schema

@Schema()
export class Quiz extends Document {
  @Prop({ required: true, unique: true })
  quiz_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
    module_id: mongoose.Schema.Types.ObjectId;


  @Prop({ type: [Question], required: true }) // Define the questions as an array of Question objects
  questions: Question[];

  @Prop({ default: Date.now }) // Automatically set to the current date/time
  created_at: Date;
}

export const QuizzesSchema = SchemaFactory.createForClass(Quiz);
