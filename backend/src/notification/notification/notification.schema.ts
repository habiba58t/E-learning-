import { Schema, Document } from 'mongoose';

export interface Notification extends Document {
  message: string;
  userName: string;
  createdAt: Date;
  isRead: boolean;
}

export const NotificationSchema = new Schema({
  message: { type: String, required: true },
  userName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
});
