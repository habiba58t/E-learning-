import { IsMongoId, IsOptional } from 'class-validator';

export class FilterQuizzesDto {
  @IsMongoId()
  @IsOptional()
  created_by?: string; // Optional filter by creator's User ObjectId

  @IsOptional()
  isOutdated?: boolean; //Optional filter for outdated quizzes
}
