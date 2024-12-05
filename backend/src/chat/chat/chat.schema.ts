// src/communication/chat/chat.schema.ts
import { Schema, Document } from 'mongoose';

export interface ChatMessage extends Document {
  message: string;
  userName: string;
  recipientUsername?: string;
  groupId?: string;
  chatType: 'one-to-one' | 'group';
  timestamp: Date;
}

export const ChatSchema = new Schema({
  message: { type: String, required: true },
  userName: { type: String, required: true },
  recipientUsername: { type: String },
  groupId: { type: String },
  chatType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
