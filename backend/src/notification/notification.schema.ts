import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { HydratedDocument } from 'mongoose';

export type notificationDocument = HydratedDocument<Notification>

@Schema()
export class Notification {
  @Prop({ required: true })
  message: string; 

  @Prop({ default: Date.now })
  createdAt: Date; 

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);