import { Expose, Type } from 'class-transformer';

export class UserInfoDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  fullName: string;
  
  @Expose()
  registrationDate: Date;

  @Expose()
  role: string;
}
