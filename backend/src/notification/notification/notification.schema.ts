import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string; // The notification message

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userName: MongooseSchema.Types.ObjectId; // Reference to the User model for the recipient

  @Prop({ default: Date.now })
  createdAt: Date; // When the notification was created

  @Prop({ default: false })
  isRead: boolean; // Whether the notification has been read
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);