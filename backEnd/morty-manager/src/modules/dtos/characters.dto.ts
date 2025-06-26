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

export class CharacterFilterDto {
  @IsOptional()
  @IsIn(['favorites'])
  filter?: 'favorites';

  @IsOptional()
  @IsIn(['name', 'status', 'species', 'gender', 'created'])
  sortBy?: 'name' | 'status' | 'species' | 'gender' | 'created';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}