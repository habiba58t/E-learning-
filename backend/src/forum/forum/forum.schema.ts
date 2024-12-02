// src/communication/forum/forum.schema.ts
import { Schema, Document } from 'mongoose';

export interface ForumThread extends Document {
  courseId: string;         // Course ID that the forum belongs to
  courseName: string;       // The name of the course
  title: string;            // The title of the forum thread
  creatorId: string;       // The user who created the thread
  replies: {                // List of replies to the thread
    userId: string;         // ID of the user who made the reply
    message: string;        // Reply message
    timestamp: Date;        // Timestamp of the reply
  }[];
  timestamp: Date;         // Timestamp of when the thread was created
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
