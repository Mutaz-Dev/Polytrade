
import { ConfigService } from '@nestjs/config';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  constructor(readonly configService: ConfigService) {};
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn({ name: 'created_at' }) created_at: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updated_at: Date;
  @DeleteDateColumn({ name: 'deleted_at' }) deleted_at: Date;

}