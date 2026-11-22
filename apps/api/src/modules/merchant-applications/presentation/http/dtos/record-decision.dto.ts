import { IsEnum, IsOptional, IsString } from 'class-validator';

enum DecisionType {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INFO_REQUESTED = 'INFO_REQUESTED',
}

export class RecordDecisionDto {
  @IsEnum(DecisionType)
  decision!: 'APPROVED' | 'REJECTED' | 'INFO_REQUESTED';

  @IsOptional()
  @IsString()
  notes?: string;
}
