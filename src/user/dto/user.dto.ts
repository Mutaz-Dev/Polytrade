import { Expose, Type } from 'class-transformer';
import { RoleDto } from './role.dto';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;
  
  @Expose()
  registrationDate: Date;

  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
}
