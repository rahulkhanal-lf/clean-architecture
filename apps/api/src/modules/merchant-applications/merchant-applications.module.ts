import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantApplicationRepository } from './application/ports/merchant-application.repository.port.js';
import { KybQueuePort } from './application/ports/kyb-queue.port.js';
import { CreateApplicationUseCase } from './application/use-cases/create-application.use-case.js';
import { GetApplicationUseCase } from './application/use-cases/get-application.use-case.js';
import { ListApplicationsUseCase } from './application/use-cases/list-applications.use-case.js';
import { SubmitApplicationUseCase } from './application/use-cases/submit-application.use-case.js';
import { UpdateApplicationUseCase } from './application/use-cases/update-application.use-case.js';
import { MerchantApplicationEntity } from './infrastructure/entities/merchant-application.entity.js';
import { MerchantApplicationTypeOrmRepository } from './infrastructure/repositories/merchant-application.typeorm.repository.js';
import { FieldEncryptionService } from './infrastructure/services/field-encryption.service.js';
import { KybBullMQQueue, KYB_QUEUE_NAME } from './infrastructure/queue/kyb.bullmq.queue.js';
import { MerchantsController } from './presentation/http/merchants.controller.js';
import { IdentityModule } from '../identity/identity.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantApplicationEntity]),
    BullModule.registerQueue({ name: KYB_QUEUE_NAME }),
    IdentityModule,
  ],
  controllers: [MerchantsController],
  providers: [
    CreateApplicationUseCase,
    GetApplicationUseCase,
    ListApplicationsUseCase,
    UpdateApplicationUseCase,
    SubmitApplicationUseCase,
    FieldEncryptionService,
    { provide: MerchantApplicationRepository, useClass: MerchantApplicationTypeOrmRepository },
    { provide: KybQueuePort, useClass: KybBullMQQueue },
  ],
  exports: [MerchantApplicationRepository],
})
export class MerchantApplicationsModule {}
