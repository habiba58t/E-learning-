import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

// Enum for Chat Type
export enum ChatType {
  Private = 0,
  Group = 1,
}

@Schema()
export class Chat {
  // Array of message references
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: mongoose.Types.ObjectId[];

  // Array of member usernames
  @Prop({ type: [String], required: true })
  members: string[];

  // Group name (only for group chats)
  @Prop({
    type: String,
    required: function (this: Chat) {
      return this.type === ChatType.Group;
    },
  })
  groupName?: string;

  // Created by (username or ID of creator)
  @Prop({ type: String, required: true })
  createdBy: string;

  // Created at timestamp
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  // Chat type: Private (0) or Group (1)
  @Prop({ type: Number, enum: ChatType, required: true })
  type: ChatType;
}

// Generate the Mongoose schema
export const ChatSchema = SchemaFactory.createForClass(Chat);