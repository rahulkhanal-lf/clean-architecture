import { MerchantApplication } from '../../domain/merchant-application.js';
import { RiskStatus } from '../../domain/risk-status.enum.js';

export abstract class MerchantApplicationRepository {
  abstract create(createdById: string): Promise<MerchantApplication>;
  abstract findById(id: string): Promise<MerchantApplication | null>;
  abstract findByIdAndOwner(id: string, createdById: string): Promise<MerchantApplication | null>;
  abstract findStalledApplications(): Promise<MerchantApplication[]>;
  abstract save(application: MerchantApplication): Promise<MerchantApplication>;
  abstract submit(application: MerchantApplication): Promise<MerchantApplication>;
  abstract recordRiskAssessment(application: MerchantApplication, outcome: RiskStatus, reference: string, checkedAt: Date): Promise<MerchantApplication>;
  abstract markRiskReviewFailed(application: MerchantApplication): Promise<MerchantApplication>;
  abstract listByOwner(createdById: string): Promise<MerchantApplication[]>;
}
