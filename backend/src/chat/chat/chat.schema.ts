// src/communication/chat/chat.schema.ts
import { Schema, Document } from 'mongoose';

export interface ChatMessage extends Document {
  message: string;
  userId: string;
  recipientId?: string;
  groupId?: string;
  chatType: 'one-to-one' | 'group';
  timestamp: Date;
}

export const ChatSchema = new Schema({
  message: { type: String, required: true },
  userId: { type: String, required: true },
  recipientId: { type: String },
  groupId: { type: String },
  chatType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
