import { IsString, MinLength } from 'class-validator';

export class CreateAccountTypeDto {
  @IsString()
  @MinLength(1)
  name: string;
}
