import { Schema } from 'mongoose';

export const InteractionSchema = new Schema({
    interaction_id: { type: String, required: true },
    user_id: { type: String, required: true },
    course_id: { type: String, required: true },
    score: { type: Number, required: true },
    time_spent_minutes: { type: Number, required: true },
    last_accessed: { type: Date, required: true }
});
