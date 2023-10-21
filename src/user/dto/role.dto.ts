import { Expose } from '@nestjs/class-transformer';
export class RoleDto {
  @Expose()
  name: string;
}
