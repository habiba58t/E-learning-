// create-quiz.dto.ts

import { IsEnum, IsNumber } from 'class-validator';

export enum QuestionType {
  MCQ = 'mcq',
  TRUE_FALSE = 't/f',
  BOTH = 'both',
}

export class CreateQuizDto {
  @IsNumber()
  no_of_questions: number;

  @IsEnum(QuestionType, { message: 'types_of_questions must be mcq, t/f, or both' })
  types_of_questions: QuestionType;
}
