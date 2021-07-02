import {
  IsMongoId,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  _list: string;

  @IsMongoId({ each: true })
  assets: string[];
  @IsMongoId({ each: true })
  _subtasks: string[];

  @IsString({
    each: true,
  })
  @IsOptional()
  description?: string;

  @IsString({
    each: true,
  })
  @IsOptional()
  comments?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;
}
