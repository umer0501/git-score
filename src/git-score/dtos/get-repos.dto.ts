import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetReposDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: 'createdAfter must be a valid date format: YYYY-MM-DD' },
  )
  createdAfter?: string;

  @IsOptional()
  @IsString({ message: 'language must be a string' })
  language?: string;
}
