import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Schema} from "mongoose";

export class CreateListDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly space: Schema.Types.ObjectId;
}
