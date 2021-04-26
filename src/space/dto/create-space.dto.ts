import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Schema} from "mongoose";

export class CreateSpaceDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly _workspace: Schema.Types.ObjectId;
}
