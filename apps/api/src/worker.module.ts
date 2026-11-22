import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantApplicationRepository } from './modules/merchant-applications/application/ports/merchant-application.repository.port.js';
import { KybQueuePort } from './modules/merchant-applications/application/ports/kyb-queue.port.js';
import { ProcessRiskReviewUseCase } from './modules/merchant-applications/application/use-cases/process-risk-review.use-case.js';
import { UserEntity } from './modules/identity/infrastructure/entities/user.entity.js';
import { MerchantApplicationEntity } from './modules/merchant-applications/infrastructure/entities/merchant-application.entity.js';
import { KybHttpClient } from './modules/merchant-applications/infrastructure/http/kyb-http-client.js';
import { ProcessRiskReviewProcessor } from './modules/merchant-applications/infrastructure/jobs/process-risk-review.processor.js';
import { StalledReviewSweep } from './modules/merchant-applications/infrastructure/jobs/stalled-review.sweep.js';
import { KybBullMQQueue, KYB_QUEUE_NAME } from './modules/merchant-applications/infrastructure/queue/kyb.bullmq.queue.js';
import { MerchantApplicationTypeOrmRepository } from './modules/merchant-applications/infrastructure/repositories/merchant-application.typeorm.repository.js';
import { FieldEncryptionService } from './modules/merchant-applications/infrastructure/services/field-encryption.service.js';
import { KybProviderPort } from './modules/merchant-applications/application/ports/kyb-provider.port.js';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: {
        host: process.env['REDIS_HOST'] ?? 'localhost',
        port: Number(process.env['REDIS_PORT'] ?? 6379),
      },
    }),
    BullModule.registerQueue({
      name: KYB_QUEUE_NAME,
      defaultJobOptions: {
        attempts: 4,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'] ?? 'localhost',
      port: Number(process.env['DB_PORT'] ?? 5433),
      username: process.env['DB_USER'] ?? 'postgres',
      password: process.env['DB_PASS'] ?? 'postgres',
      database: process.env['DB_NAME'] ?? 'psp',
      entities: [UserEntity, MerchantApplicationEntity],
      synchronize: false,
    }),
    TypeOrmModule.forFeature([MerchantApplicationEntity]),
  ],
  providers: [
    ProcessRiskReviewUseCase,
    ProcessRiskReviewProcessor,
    StalledReviewSweep,
    FieldEncryptionService,
    { provide: MerchantApplicationRepository, useClass: MerchantApplicationTypeOrmRepository },
    { provide: KybProviderPort, useClass: KybHttpClient },
    { provide: KybQueuePort, useClass: KybBullMQQueue },
  ],
})
export class WorkerModule {}
