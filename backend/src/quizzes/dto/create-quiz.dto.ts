import { IsNotEmpty, IsString, IsEnum, IsNumber, ArrayNotEmpty, IsBoolean, IsMongoId } from 'class-validator';

export class CreateQuizDto {
  @IsMongoId({ each: true })
  @ArrayNotEmpty()
  questions: string[]; // Array of Question ObjectIds

  @IsString()
  @IsNotEmpty()
  created_by: string; // Username of the quiz creator

  @IsNumber()
  @IsNotEmpty()
  no_of_questions: number; // Number of questions in the quiz

  @IsEnum(['mcq', 't/f', 'both'], { message: 'types_of_questions must be one of: mcq, t/f, both' })
  types_of_questions: 'mcq' | 't/f' | 'both'; // Question types

  @IsBoolean()
  @IsNotEmpty()
  isOutdated: boolean; // Indicates if the quiz is outdated
}
