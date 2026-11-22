import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/index.js';
import { Role } from '../../domain/role.enum.js';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ type: 'enum', enum: Role })
  role!: Role;
}
