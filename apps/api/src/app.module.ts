import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';
import { UserEntity } from './modules/identity/infrastructure/entities/user.entity.js';
import { MerchantApplicationEntity } from './modules/merchant-applications/infrastructure/entities/merchant-application.entity.js';
import { InitialSchema1700000000000 } from './migrations/1700000000000-InitialSchema.js';
import { IdentityModule } from './modules/identity/identity.module.js';
import { MerchantApplicationsModule } from './modules/merchant-applications/merchant-applications.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USER'],
      password: process.env['DB_PASS'],
      database: process.env['DB_NAME'],
      entities: [UserEntity, MerchantApplicationEntity],
      migrations: [InitialSchema1700000000000],
      migrationsRun: true,
      synchronize: false,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'],
        port: Number(process.env['REDIS_PORT']),
      },
    }),
    IdentityModule,
    MerchantApplicationsModule,
  ],
})
export class AppModule {}
