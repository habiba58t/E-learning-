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

  @Prop({ required: true, default: Date.now })
  last_accessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
