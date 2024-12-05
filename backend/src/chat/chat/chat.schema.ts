import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema()
export class ChatMessage {
  @Prop({ required: true })
  message: string; // The message content

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userName: MongooseSchema.Types.ObjectId; // Reference to the User model for the sender

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  recipientUsername?: MongooseSchema.Types.ObjectId; // Optional: reference to the User model for one-to-one chat recipient

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  groupName?: MongooseSchema.Types.ObjectId; // Optional: reference to the Group model for group chat

  @Prop({ required: true, enum: ['one-to-one', 'group'] })
  chatType: 'one-to-one' | 'group'; // Indicates the type of chat

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of when the message was sent
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);