import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ForumThreadDocument = ForumThread & Document;

class Reply {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userName: MongooseSchema.Types.ObjectId; // Reference to the User model

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema()
export class ForumThread {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseName: MongooseSchema.Types.ObjectId; // Reference to the Course model

  @Prop({ required: true })
  title: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  creatorName: MongooseSchema.Types.ObjectId; // Reference to the User model for the creator

  @Prop({ type: [Reply], default: [] }) // Array of replies
  replies: Reply[];

  @Prop({ default: Date.now }) // Timestamp for thread creation
  timestamp: Date;
}

export const ForumSchema = SchemaFactory.createForClass(ForumThread);