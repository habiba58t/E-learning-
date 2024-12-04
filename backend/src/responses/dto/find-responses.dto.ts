import { IsMongoId, IsOptional } from 'class-validator';

export class FindResponsesDto {
  @IsMongoId()
  @IsOptional()
  username?: string;

  @IsMongoId()
  @IsOptional()
  course_code?: string;
}
