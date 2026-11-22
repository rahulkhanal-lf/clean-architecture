import { Column, Entity, JoinColumn, ManyToOne, VersionColumn } from 'typeorm';
import { BaseEntity } from '../../../../common/entities/index.js';
import { UserEntity } from '../../../identity/infrastructure/entities/user.entity.js';
import { ApplicationStatus } from '../../domain/application-status.enum.js';
import { RiskStatus } from '../../domain/risk-status.enum.js';

@Entity('merchant_applications')
export class MerchantApplicationEntity extends BaseEntity {
  @Column({ name: 'created_by_id' })
  createdById!: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'created_by_id' })
  createdBy!: UserEntity;

  @Column({ name: 'assigned_reviewer_id', nullable: true })
  assignedReviewerId!: string | null;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'assigned_reviewer_id' })
  assignedReviewer!: UserEntity | null;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.DRAFT })
  status!: ApplicationStatus;

  @Column({ type: 'enum', enum: RiskStatus, name: 'risk_status', nullable: true })
  riskStatus!: RiskStatus | null;

  @Column({ name: 'submission_count', default: 0 })
  submissionCount!: number;

  @Column({ name: 'business_name', nullable: true })
  businessName!: string | null;

  @Column({ name: 'legal_business_name', nullable: true })
  legalBusinessName!: string | null;

  @Column({ name: 'business_type', nullable: true })
  businessType!: string | null;

  @Column({ nullable: true })
  country!: string | null;

  @Column({ nullable: true })
  mcc!: string | null;

  @Column({ name: 'monthly_volume', type: 'numeric', nullable: true })
  monthlyVolume!: number | null;

  // Stores encrypted: { firstName, lastName, ssn, dateOfBirth, taxId }
  @Column({ name: 'owner_info', type: 'jsonb', nullable: true })
  ownerInfo!: Record<string, string> | null;

  // Stores encrypted values
  @Column({ name: 'bank_account_number', nullable: true })
  bankAccountNumber!: string | null;

  @Column({ name: 'routing_number', nullable: true })
  routingNumber!: string | null;

  @Column({ name: 'risk_score', type: 'numeric', nullable: true })
  riskScore!: number | null;

  @Column({ name: 'risk_reasons', type: 'text', array: true, nullable: true })
  riskReasons!: string[] | null;

  @Column({ name: 'risk_reference', nullable: true })
  riskReference!: string | null;

  @Column({ name: 'risk_checked_at', type: 'timestamptz', nullable: true })
  riskCheckedAt!: Date | null;

  @Column({ name: 'submitted_at', type: 'timestamptz', nullable: true })
  submittedAt!: Date | null;

  @Column({ name: 'decided_at', type: 'timestamptz', nullable: true })
  decidedAt!: Date | null;

  @VersionColumn()
  version!: number;
}
