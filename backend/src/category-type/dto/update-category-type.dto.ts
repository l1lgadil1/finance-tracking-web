import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateCategoryTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
