import { Expose } from 'class-transformer';
import { IsString, MinLength, IsEmail, IsNumber, IsDate } from "@nestjs/class-validator";


export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  fullName: string;
  
  @Expose()
  @IsDate()
  registrationDate: Date;

}


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


export class UserIdDto {
  @Expose()
  @IsNumber()
  id: number;
}
