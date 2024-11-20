import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ModulesController } from 'src/modules/modules.controller';
import {Module} from '../modules/modules.schema';
// Defining the CoursesDocument type
export type CoursesDocument = Courses & Document;

@Schema()
export class Courses {
  @Prop({ required: true, unique: true })
  course_code: string;

  @Prop({ required: true })
  title: string; 

  @Prop({ required: true })
  description: string;

  @Prop({ required: true})
  category: string; 

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  level: string; 

  @Prop({ required: true })
  created_by: string;

  @Prop({ required: true })
  created_at: Date; 

  @Prop({ type: [{ type:mongoose.Schema.Types.ObjectId, ref: 'modules' }] })
  modules: Module[];
}

export const CoursesSchema = SchemaFactory.createForClass(Courses);
