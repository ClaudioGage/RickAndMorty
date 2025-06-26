import { IsOptional, IsString, IsNumber, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CharacterQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['alive', 'dead', 'unknown'])
  status?: 'alive' | 'dead' | 'unknown';

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsIn(['female', 'male', 'genderless', 'unknown'])
  gender?: 'female' | 'male' | 'genderless' | 'unknown';
}