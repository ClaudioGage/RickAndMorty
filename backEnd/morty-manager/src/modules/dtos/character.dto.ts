import { IsOptional, IsIn, IsString } from "class-validator";

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