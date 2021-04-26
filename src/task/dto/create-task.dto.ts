import {IsNotEmpty, IsString, MaxLength} from "class-validator";
import {Schema} from "mongoose";

export class CreateTaskDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly _list: Schema.Types.ObjectId;
}
