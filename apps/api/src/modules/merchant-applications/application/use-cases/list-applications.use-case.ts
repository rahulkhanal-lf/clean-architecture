import { Injectable } from '@nestjs/common';
import { MerchantApplication } from '../../domain/merchant-application.js';
import { MerchantApplicationRepository } from '../ports/merchant-application.repository.port.js';
import { ApplicationStatus } from '../../domain/application-status.enum.js';
import { Role } from '../../../identity/domain/role.enum.js';

@Injectable()
export class ListApplicationsUseCase {
  constructor(private readonly repo: MerchantApplicationRepository) {}

  execute(actorId: string, role: Role): Promise<MerchantApplication[]> {
    if (role === Role.ADMIN) return this.repo.listAll();
    if (role === Role.REVIEWER) return this.repo.listByStatus(ApplicationStatus.UNDER_REVIEW);
    return this.repo.listByOwner(actorId);
  }
}
