import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';

export type privatechatDocument = HydratedDocument<PrivateChat>;

@Schema()
export class PrivateChat {
  @Prop({ required: true })
  member1: string; // Two usernames involved in the chat

  @Prop({ required: true })
  member2: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  Message: mongoose.Types.ObjectId[];
}

export const PrivateChatSchema = SchemaFactory.createForClass(PrivateChat);

// Add a compound index to enforce uniqueness
PrivateChatSchema.index(
  { member1: 1, member2: 1 },
  { unique: true, partialFilterExpression: { member1: { $exists: true }, member2: { $exists: true } } }
);

// Middleware to normalize member1 and member2 to ensure symmetry
PrivateChatSchema.pre('save', function (next) {
  if (this.member1 > this.member2) {
    [this.member1, this.member2] = [this.member2, this.member1];
  }
  next();
});
