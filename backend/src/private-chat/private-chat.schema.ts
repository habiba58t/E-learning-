import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';


export type privatechatDocument =  HydratedDocument<PrivateChat>
@Schema()
export class PrivateChat {

  @Prop({ required: true })
  member1: string ;// Two usernames involved in the chat
  @Prop({ required: true })
  member2: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
      Message:mongoose.Types.ObjectId[];
    
}

export const PrivateChatSchema = SchemaFactory.createForClass(PrivateChat)