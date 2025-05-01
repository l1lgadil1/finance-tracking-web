import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAccountTypeDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
