import { IsMongoId } from 'class-validator';

export class GetAllWorkspacesForUserDto {
  @IsMongoId()
  userId: string;
}
