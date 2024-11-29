import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Quiz } from '../quizzes/quizzes.schema'; // Adjust the import path if needed
import { Question } from '../questions/questions.schema'; // Adjust the import path if needed
import { Document,Types } from 'mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';

export type moduleDocument = HydratedDocument<Module>
@Schema()
export class Module {
  @Prop({ required: true,unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  resources: string[];

  @Prop({ required: true })
  level: string;

  @Prop({ required: true })
  status: number ;

  //_id: mongoose.Schema.Types.ObjectId;

  // Reference to Quiz documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] })
  quizzes: mongoose.Schema.Types.ObjectId[];

  // Reference to Question documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: mongoose.Schema.Types.ObjectId[];

  // Reference to notes documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }] })
  notes: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: true, default: Date.now })
  created_at: Date;
}
export const ModuleSchema = SchemaFactory.createForClass(Module);
