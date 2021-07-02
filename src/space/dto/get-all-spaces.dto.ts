import { IsMongoId } from 'class-validator';
import { PaginationQueryDto } from '../../user/dtos/pagination-query.dto';

export class GetAllSpacesDto extends PaginationQueryDto {
  @IsMongoId()
  workspaceId: string;
}
