import { IsString, MinLength, IsEmail } from "@nestjs/class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(8)
    password:string;

    @IsEmail()
    email:string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

}
