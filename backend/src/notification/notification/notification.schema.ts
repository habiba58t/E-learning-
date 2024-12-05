import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string; // The notification message

  @Prop({ required: true })
  userName: string; // Username of the recipient

  @Prop({ default: Date.now })
  createdAt: Date; // When the notification was created

  @Prop({ default: false })
  isRead: boolean; // Whether the notification has been read
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
