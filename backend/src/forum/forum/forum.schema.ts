// src/communication/forum/forum.schema.ts
import { Schema, Document } from 'mongoose';

export interface ForumThread extends Document {
  courseId: string;
  courseName: string;
  title: string;
  creatorId: string;
  replies: {
    userId: string;
    message: string;
    timestamp: Date;
  }[];
  timestamp: Date;
}

export const ForumSchema = new Schema({
  courseId: { type: String, required: true },
  courseName: { type: String, required: true },
  title: { type: String, required: true },
  creatorId: { type: String, required: true },
  replies: [
    {
      userId: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  timestamp: { type: Date, default: Date.now },
});
