// src/communication/chat/group.schema.ts
import { Schema, Document } from 'mongoose';

export interface Group extends Document {
  name: string;
  adminUsername: string;
  memberUsernames: string[];
  isOpen: boolean; // Added property to indicate if the group is open
}

export const GroupSchema = new Schema({
  name: { type: String, required: true },
  adminUsername: { type: String, required: true },
  memberUsernames: { type: [String], default: [] },
  isOpen: { type: Boolean, default: true }, // Open groups by default
});
