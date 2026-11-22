import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { UserEntity } from './modules/identity/infrastructure/entities/user.entity.js';
import { MerchantApplicationEntity } from './modules/merchant-applications/infrastructure/entities/merchant-application.entity.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { MerchantApplicationsModule } from './modules/merchant-applications/merchant-applications.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT'] ?? 5433),
      username: process.env['DB_USER'] ?? 'postgres',
      password: process.env['DB_PASS'] ?? 'postgres',
      database: process.env['DB_NAME'] ?? 'psp',
      entities: [UserEntity, MerchantApplicationEntity],
      synchronize: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: Number(process.env['REDIS_PORT'] ?? 6379),
      },
    }),
    IdentityModule,
    MerchantApplicationsModule,
  ],
})
export class AppModule {}
