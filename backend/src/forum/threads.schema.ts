import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Reply } from "./reply.schema";
export type threadDocument = HydratedDocument<Threads>
@Schema()
export class Threads {
  @Prop({ required: true })
  title: string;

  @Prop({required: true })
  message: string;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reply' }]}) // Array of replies
  replies:mongoose.Types.ObjectId[];

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: true })
  created_by: string;
}

export const ThreadSchema = SchemaFactory.createForClass(Threads);