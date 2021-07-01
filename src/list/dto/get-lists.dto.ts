import { IsMongoId } from 'class-validator';
import { PaginationQueryDto } from '../../user/dtos/pagination-query.dto';

export class GetListsDto extends PaginationQueryDto {
  @IsMongoId()
  _space: string;


}
