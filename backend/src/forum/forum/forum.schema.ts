import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ForumThreadDocument = ForumThread & Document;

class Reply {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

@Schema()
export class ForumThread {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ type: [Reply], default: [] }) // Array of replies
  replies: Reply[];

  @Prop({ default: Date.now }) // Timestamp for thread creation
  timestamp: Date;
}

export const ForumSchema = SchemaFactory.createForClass(ForumThread);
