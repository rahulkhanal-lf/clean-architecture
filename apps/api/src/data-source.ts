import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { UserEntity } from './modules/identity/infrastructure/entities/user.entity.js';
import { MerchantApplicationEntity } from './modules/merchant-applications/infrastructure/entities/merchant-application.entity.js';
import { InitialSchema1700000000000 } from './migrations/1700000000000-InitialSchema.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] ?? 'localhost',
  port: Number(process.env['DB_PORT'] ?? 5433),
  username: process.env['DB_USER'] ?? 'postgres',
  password: process.env['DB_PASS'] ?? 'postgres',
  database: process.env['DB_NAME'] ?? 'psp',
  entities: [UserEntity, MerchantApplicationEntity],
  migrations: [InitialSchema1700000000000],
  synchronize: false,
});
