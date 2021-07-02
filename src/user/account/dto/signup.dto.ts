import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
