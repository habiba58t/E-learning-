import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Responses { 
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users'})
  username: mongoose.Schema.Types.ObjectId;

  // Store answers with the associated question ID
  @Prop({ required: true, type: [{ questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, answer: String }] })
  answers: { questionId: mongoose.Schema.Types.ObjectId, answer: string }[];

  @Prop({ required: true })
  score: number;

  @Prop({ required: true, type: Date, default: Date.now })
  submittedAt: Date;
}

export const ResponsesSchema = SchemaFactory.createForClass(Responses);
