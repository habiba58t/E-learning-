import { IsMongoId, IsOptional, IsEnum, IsNumber, IsBoolean } from 'class-validator';

export class UpdateQuizDto {
  @IsMongoId({ each: true })
  @IsOptional()
  questions?: string[];  // Optional update for questions, each being a MongoDB ObjectId

  @IsNumber()
  @IsOptional()
  no_of_questions?: number;  // Optional number of questions

  @IsEnum(['mcq', 't/f', 'both'])
  @IsOptional()
  types_of_questions?: 'mcq' | 't/f' | 'both';  // Optional question type, must be 'mcq', 't/f', or 'both'

  @IsBoolean()
  @IsOptional()
  isOutdated?: boolean;  // Optional flag to mark the quiz as outdated
}
