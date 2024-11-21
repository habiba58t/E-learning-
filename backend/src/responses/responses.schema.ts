import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()

export class Responses{
  @Prop({required:true, unique:true})
  email:string;

 @Prop({ required: true, type: [{ type: Object }] })
  answers: { [key: string]: any }[];

  @Prop({required:true})
  score:number;

  @Prop({ required: true, type: Date, default: Date.now })
  submittedAt: Date;


}
export const ResponsesSchema = SchemaFactory.createForClass(Responses);















