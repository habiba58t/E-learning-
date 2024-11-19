import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Defining the UserDocument type
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  user_id: string; 

  @Prop({ required: true })
  name: string; 

  @Prop({ required: true, unique: true })
  email: string; 

  @Prop({ required: true })
  password: string; 

  @Prop({ required: true })
  profile_hash: string; 

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: string; 

  @Prop({ required: false })
  picture_url: string; 

  @Prop({ required: true })
  created_at: Date; 
}

export const UserSchema = SchemaFactory.createForClass(User);
