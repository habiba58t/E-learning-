import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema()
export class ChatMessage {
  @Prop({ required: true })
  message: string; // The message content

  @Prop({ required: true })
  userName: string; // The sender's username

  @Prop()
  recipientUsername?: string; // Optional: recipient username for one-to-one chat

  @Prop()
  groupName?: string; // Optional: group name for group chat

  @Prop({ required: true, enum: ['one-to-one', 'group'] })
  chatType: 'one-to-one' | 'group'; // Indicates the type of chat

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of when the message was sent
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
