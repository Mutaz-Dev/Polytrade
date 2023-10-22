import { IsString, MinLength, IsEmail } from "@nestjs/class-validator";

export class CreateUserDto {

    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

}
