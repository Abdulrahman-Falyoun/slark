import { IsMongoId, IsOptional } from 'class-validator';

export class GetAllWorkspacesForUserDto {
  @IsMongoId()
  @IsOptional()
  userId?: string;
}
