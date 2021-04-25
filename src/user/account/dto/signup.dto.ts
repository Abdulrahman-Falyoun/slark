import {IsEmail, IsNotEmpty, IsString, MaxLength} from "class-validator";


export class SignupDto {
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    readonly email: string;


    @IsString()
    @IsNotEmpty()
    readonly password: string;
}