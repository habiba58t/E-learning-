import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Quiz } from '../quizzes/quizzes.schema'; // Adjust the import path if needed
import { Question } from '../questions/questions.schema'; // Adjust the import path if needed
import { Types } from 'mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';
import { Content } from 'src/content/content.schema';

export type moduleDocument = HydratedDocument<Module>
@Schema()
export class Module {
  @Prop({ required: true,unique: true })
  title: string;

  @Prop({ required: true, enum: ['easy', 'medium', 'hard'] })
  level: string;

  @Prop()
  status: number ;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }] })
  content: mongoose.Types.ObjectId[];

  // Reference to Quiz documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }] })
  quizzes:mongoose.Types.ObjectId[];

  // Reference to Question documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] })
  questions: mongoose.Types.ObjectId[];

  // Reference to notes documents using ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }] })
  notes: mongoose.Types.ObjectId[];

  @Prop({ required: true, default: Date.now })
  created_at: Date;

  @Prop()
  totalRating: number; //sum of ratings for module
  
  @Prop()
  totalStudents: number; //number of students who voted for module

  @Prop()
   averageRating: number; 

  @Prop()
  isOutdated: boolean=false;

  @Prop({default:true})
  enableNotes: boolean;
}
export const ModuleSchema = SchemaFactory.createForClass(Module);
