import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProgressDocument = HydratedDocument<Progress>;
@Schema()
export class Progress {  
  @Prop({ required: true })
  Username: string;
  
  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true })
  completion_percentage: number;

  @Prop({ required: true })
  last_accessed: Date;
}

// Define ProgressDocument as a HydratedDocument type for the Progress schema


// Create the Mongoose schema model (avoid duplication with the class name)
export const ProgressSchema = SchemaFactory.createForClass(Progress);
