import { Injectable } from '@nestjs/common';
import { MerchantApplication } from '../../domain/merchant-application.js';
import { MerchantApplicationRepository } from '../ports/merchant-application.repository.port.js';

@Injectable()
export class CreateApplicationUseCase {
  constructor(private readonly repo: MerchantApplicationRepository) {}

  execute(actorId: string): Promise<MerchantApplication> {
    return this.repo.create(actorId);
  }
}
