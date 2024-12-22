
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';


export type GroupDocument  = HydratedDocument<GroupChat>
@Schema()
export class GroupChat {
  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true ,unique: true})
  group_name: string;

  @Prop({ required: true })
  createdBy: string; // Creator username

  @Prop({ required: true, default: [] })
  members: string[]; // Array of usernames in the group

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], default: [] })
messages:mongoose.Types.ObjectId[];
  
}
export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);