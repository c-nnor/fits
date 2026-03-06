import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    username: string;
}