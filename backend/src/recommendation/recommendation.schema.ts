import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recommendation {
  @Prop({ required: true, unique: true })
  recommendationid: string; 

  @Prop({ required: true })
  userid: string; 

  @Prop({ type: [String], required: true })
  recommendeditems: string[]; 

  @Prop({ default: Date.now })
  generatedat: Date; 
}

export const RecommendationSchema = SchemaFactory.createForClass(Recommendation);
