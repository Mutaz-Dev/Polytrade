import { IsEmail, IsString } from '@nestjs/class-validator';

export class LoginUserDto {

  @IsString()
  username: string

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
