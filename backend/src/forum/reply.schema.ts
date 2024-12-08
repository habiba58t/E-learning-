import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema()
export class Reply {
    @Prop({ required: true }) 
    username: string; 
  
    @Prop({ required: true })
    message: string;
  
    @Prop({ default: Date.now })
    timestamp: Date;
  }
  export type replyDocument = HydratedDocument<Reply>
  export const replySchema = SchemaFactory.createForClass(Reply);