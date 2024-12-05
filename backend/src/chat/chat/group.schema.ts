import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type GroupDocument = Group & Document;

@Schema()
export class Group {
  @Prop({ required: true })
  name: string; // Group name

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  adminUsername: MongooseSchema.Types.ObjectId; // Reference to User model for the admin

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  memberUsernames: MongooseSchema.Types.ObjectId[]; // References to User model for group members

  @Prop({ default: true })
  isOpen: boolean; // Whether the group is open for anyone to join
}

export const GroupSchema = SchemaFactory.createForClass(Group);