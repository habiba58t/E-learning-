import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Note  {
  @Prop({ required: true })
  Username: string;

  @Prop()
  course_code?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
