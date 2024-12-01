import { IsObject, IsString, IsNotEmpty } from 'class-validator';

export class SubmitQuizDto {
  @IsObject()
  studentAnswersObject: Record<string, string>;  // The student answers
}
