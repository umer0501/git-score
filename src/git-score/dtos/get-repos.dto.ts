import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class GetReposDto {
  @IsNotEmpty({ message: 'createdAfter is required' })
  @IsDateString(
    {},
    { message: 'createdAfter must be a valid date format: YYYY-MM-DD' },
  )
  createdAfter: string;

  @IsNotEmpty({ message: 'language is required' })
  @IsString({ message: 'language must be a string' })
  language: string;
}
