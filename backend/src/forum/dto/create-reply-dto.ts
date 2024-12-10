import mongoose from "mongoose";

export class CreateReplyDto {
    threadId: mongoose.Types.ObjectId;
    message: string;
    }