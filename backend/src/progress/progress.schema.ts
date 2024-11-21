import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = progressSchema & Document;

@Schema()
export class progressSchema {
  
  @Prop({ required: true})
  email: string;
  
  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;

  
}

export const ProgressSchema = SchemaFactory.createForClass(progressSchema);
