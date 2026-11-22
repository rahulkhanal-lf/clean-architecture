import { Injectable, NotFoundException } from '@nestjs/common';
import { MerchantApplication } from '../../domain/merchant-application.js';
import { MerchantApplicationRepository } from '../ports/merchant-application.repository.port.js';

@Injectable()
export class GetApplicationUseCase {
  constructor(private readonly repo: MerchantApplicationRepository) {}

  async execute(id: string, actorId: string): Promise<MerchantApplication> {
    const app = await this.repo.findByIdAndOwner(id, actorId);
    if (!app) throw new NotFoundException('Application not found');
    return app;
  }
}
