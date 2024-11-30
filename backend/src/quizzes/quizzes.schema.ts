import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Question } from '../questions/questions.schema'; // Import Question schema
import { Responses } from '../responses/responses.schema'; // Import Responses schema

@Schema()
export class Quiz {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    required: true,
  }) // Reference to Question schema using ObjectId
  questions: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Responses' }],
    default: [],
  }) // Reference to Responses schema using ObjectId
  responses: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: Date.now }) // Automatically set to the current date/time
  created_at: Date;
}

export const QuizzesSchema = SchemaFactory.createForClass(Quiz);
