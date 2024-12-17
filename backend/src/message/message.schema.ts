import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  // The content of the message
  @Prop({  required: true })
  content: string;

  // Sender of the message (username or user ID)
  @Prop({ required: true })
  sentBy: string;

  // Timestamp for when the message was sent
  @Prop({ default: Date.now })
  sentAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);