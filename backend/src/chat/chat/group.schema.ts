import { Schema, Document } from 'mongoose';

export interface Group extends Document {
  name: string;               // Group name
  adminUsername: string;      // Admin username
  memberUsernames: string[];  // array of members
  createdAt: Date;            // creation time
}

export const GroupSchema = new Schema({
  name: { type: String, required: true },
  adminUsername: { type: String, required: true },     
  memberUsernames: { type: [String], required: true }, // Admin automatically added as a member
  createdAt: { type: Date, default: Date.now },
});
