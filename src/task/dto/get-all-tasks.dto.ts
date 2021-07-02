import { IsMongoId, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../user/dtos/pagination-query.dto';

export class GetAllTasksDto extends PaginationQueryDto {
  @IsMongoId()
  @IsOptional()
  listId?: string;
}
