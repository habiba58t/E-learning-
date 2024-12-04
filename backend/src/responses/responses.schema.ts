import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ResponsesDocument = mongoose.HydratedDocument<Responses>;

@Schema()
export class Responses {
  @Prop({ required: true})
  username: string;

  @Prop({ required: true, type: [{ questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' }, answer: String }] })
  answers: { questionId: mongoose.Types.ObjectId; answer: string }[];

  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  course_code: string;

  @Prop({ required: true, type: Date, default: Date.now })
  submittedAt: Date;
}

export const ResponsesSchema = SchemaFactory.createForClass(Responses);