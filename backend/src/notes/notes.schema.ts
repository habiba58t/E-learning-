import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';


export type notesDocument = HydratedDocument<Notes>
@Schema()
export class Notes  {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  createdAt: Date;

  @Prop()
  lastUpdated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Notes);
