import { Expose } from '@nestjs/class-transformer';
import { IsString } from '@nestjs/class-validator';
export class RoleDto {
  @Expose()
  @IsString()
  name: string;
}
