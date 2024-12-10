import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Question } from '../questions/questions.schema'; // Import Question schema
import { Responses } from '../responses/responses.schema'; // Import Responses schema
import { Users } from '../users/users.schema'; // Import Users schema

export type QuizzesDocument = mongoose.HydratedDocument<Quiz>;

@Schema()
export class Quiz {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    required: true,
  })
  questions: mongoose.Types.ObjectId[]; // Array of Question IDs
  //these are only the questions that satisfy instructor no of questions and types
  //but final questions depend on student level
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Responses' }],
    default: [],
  })
  responses: mongoose.Types.ObjectId[]; // Array of Response IDs

  @Prop({ default: Date.now })
  created_at: Date; // Automatically set to the current date/time

  @Prop({
    required: true,
    type: String, 
  })
  created_by: string; //username of the creator

  @Prop({ required: true })
  no_of_questions: number; // Number of questions in the quiz

  @Prop({
    required: true,
    enum: ['mcq', 't/f', 'both'], //inline enum definition
  })
  types_of_questions: 'mcq' | 't/f' | 'both'; // Enum validation for question types

  @Prop({ required: true, default: false })
  isOutdated: boolean; // Indicates if the quiz is outdated
}

export const QuizzesSchema = SchemaFactory.createForClass(Quiz);