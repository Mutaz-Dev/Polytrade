
import { BaseEntity } from '../../shared/base.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
