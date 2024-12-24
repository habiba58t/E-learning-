import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'
import { HydratedDocument } from 'mongoose';

export type contentDocument = HydratedDocument<Content>
@Schema()
export class Content {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  isOutdated: boolean = false;

  @Prop({ required: true, default: new Date() })
  created_at: Date;

  @Prop({ type: [{ filePath: String, fileType: String, originalName: String }], default: [] })
  resources: { filePath: string; fileType: string; originalName: string }[];  // This should match the CreateContentDto
}
export const ContentSchema = SchemaFactory.createForClass(Content);