import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  skip?: number;

  @IsOptional()
  @IsString()
  sort: string;
}
