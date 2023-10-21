import { IsEmail, IsString } from '@nestjs/class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
