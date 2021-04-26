import {IsNotEmpty, IsString, MaxLength} from "class-validator";


export class CreateWorkspaceDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;


}
