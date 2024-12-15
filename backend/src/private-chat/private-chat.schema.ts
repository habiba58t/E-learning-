import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';

@Schema()
export class PrivateChat {
  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true })
  memeber1: string ;// Two usernames involved in the chat
  memeber2: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
      Message:mongoose.Types.ObjectId[];
    
}
