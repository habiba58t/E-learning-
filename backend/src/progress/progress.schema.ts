import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = progressSchema & Document;

@Schema()
export class progressSchema {
  @Prop({ required: true, unique: true })
  progress_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  course_id: string;

  @Prop({ required: true })
  completion_percentage : number;

  @Prop({ required: true })
  last_accessed: Date;
}

export const ProductSchema = SchemaFactory.createForClass(progressSchema);