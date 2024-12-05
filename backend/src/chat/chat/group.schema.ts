import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string; // Group name

  @Prop({ required: true })
  adminUsername: string; // Username of the group admin

  @Prop({ type: [String], default: [] })
  memberUsernames: string[]; // Array of usernames for group members

  @Prop({ default: true })
  isOpen: boolean; // Whether the group is open for anyone to join
}

export const GroupSchema = SchemaFactory.createForClass(Group);
