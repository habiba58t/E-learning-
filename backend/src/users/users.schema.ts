import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Courses } from '../courses/courses.schema'; // Adjust path as necessary
import { HydratedDocument } from 'mongoose';
import { Notes } from 'src/notes/notes.schema';
import { Role } from 'src/auth/decorators/role.decorator';
import {Notification} from 'src/notification/notification.schema';

export type userDocument = HydratedDocument<Users>
@Schema()
export class Users {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  username: string; 

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string; // Changed to camelCase

   @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
   role: string;
  

  @Prop()
  pictureUrl?: string; // Changed to camelCase and made optional

  @Prop({ default: Date.now }) // Set default to the current date
  createdAt: Date; // Changed to camelCase

  // Reference to Courses by ObjectId
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Courses' }] })
  courses: mongoose.Types.ObjectId[]; // An array of courses the user is associated with

  @Prop({ type: Map, of: [mongoose.Schema.Types.ObjectId] })
  notes: Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId[]>;  ///STUDENT Attribute only
  
  @Prop()
  totalRating: number; //sum of ratings for intructor                  //INSTRUCTOR Attribute only
  
  @Prop()
  totalStudents: number; //number of students who voted for intructor       ///INSTRUCTOR Attribute only

  @Prop()                                                                 ///INSTRUCTOR Attribute only
   averageRating: number; 

  @Prop({ type: Map, of: Number })
  studentScore: Map<mongoose.Types.ObjectId, number>;
  
  @Prop({type: Map,of: String,enum: ['easy', 'medium', 'hard'],})
  studentLevel: Map<mongoose.Types.ObjectId, string>; // Map of course id to string (enum)

  // Reference to notification documents using ObjectId
@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification'}] })
notification: mongoose.Types.ObjectId[]; 

// @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }] })
// chat: mongoose.Types.ObjectId[];


@Prop({ 
  type: Map, 
  of: Boolean, 
  ref: 'Chat'  // Adding ref to establish a reference to the Chat schema
})
chats: Map<mongoose.Types.ObjectId,boolean>;

@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threads' }] })
threads: mongoose.Types.ObjectId[];


@Prop({ type: [String], default: [] })  // Array of strings, default to empty array
hasRated: string[];  // Array of usernames (strings)

}






export const UsersSchema = SchemaFactory.createForClass(Users);
