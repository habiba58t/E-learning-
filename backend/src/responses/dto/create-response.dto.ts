import mongoose from "mongoose";


export class CreateResponseDto {
  username: string;
  answers: {
    questionId: mongoose.Types.ObjectId;
    answer: string;
  }[];
  score: number;
  submittedAt: Date;
}
