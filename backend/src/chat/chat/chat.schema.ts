// src/communication/chat/chat.schema.ts
import { Schema, Document } from 'mongoose';

export interface ChatMessage extends Document {
  message: string;
  userId: string;
  timestamp: Date;
}

export const ChatSchema = new Schema({
  message: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});
