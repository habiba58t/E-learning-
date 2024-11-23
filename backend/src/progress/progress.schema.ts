import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;  // Type for the document

@Schema()
export class Progress {  // Class name should be ProgressSchema
  @Prop({ required: true })
  Username: string;
  
  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;
}

// Create the Mongoose schema model (avoid duplication with the class name)
export const ProgressSchema= SchemaFactory.createForClass(Progress);
