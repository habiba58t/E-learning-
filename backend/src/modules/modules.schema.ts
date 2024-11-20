import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
export type ModulesDocument = Module & Document;

@Schema()
export class Module { 
  @Prop({ required: true, unique: true })
  module_id: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }] }) 
  course_id: mongoose.Schema.Types.ObjectId[]; 

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  resources: string[];

  @Prop({ required: true })
  level: string;

  @Prop({ required: true, default: Date.now }) 
  created_at: Date;
}


export const ModuleSchema = SchemaFactory.createForClass(Module);
