import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../identity/decorators/current-user.decorator.js';
import { JwtGuard } from '../../../identity/guards/jwt.guard.js';
import { RolesGuard } from '../../../identity/guards/roles.guard.js';
import { Roles } from '../../../identity/decorators/roles.decorator.js';
import { Role } from '../../../identity/domain/role.enum.js';
import type { JwtPayload } from '../../../identity/infrastructure/strategies/jwt.strategy.js';
import { CreateApplicationUseCase } from '../../application/use-cases/create-application.use-case.js';
import { GetApplicationUseCase } from '../../application/use-cases/get-application.use-case.js';
import { ListApplicationsUseCase } from '../../application/use-cases/list-applications.use-case.js';
import { SubmitApplicationUseCase } from '../../application/use-cases/submit-application.use-case.js';
import { UpdateApplicationUseCase } from '../../application/use-cases/update-application.use-case.js';
import { RecordDecisionUseCase } from '../../application/use-cases/record-decision.use-case.js';
import { AssignReviewerUseCase } from '../../application/use-cases/assign-reviewer.use-case.js';
import { RetryRiskUseCase } from '../../application/use-cases/retry-risk.use-case.js';
import { GetAuditLogsUseCase } from '../../../audit-log/application/use-cases/get-audit-logs.use-case.js';
import { FieldEncryptionService } from '../../infrastructure/services/field-encryption.service.js';
import { UpdateApplicationDto } from './dtos/update-application.dto.js';
import { RecordDecisionDto } from './dtos/record-decision.dto.js';
import { AssignReviewerDto } from './dtos/assign-reviewer.dto.js';

@ApiTags('merchants')
@ApiBearerAuth()
@Controller('merchants')
@UseGuards(JwtGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MerchantsController {
  constructor(
    private readonly createUseCase: CreateApplicationUseCase,
    private readonly getUseCase: GetApplicationUseCase,
    private readonly listUseCase: ListApplicationsUseCase,
    private readonly updateUseCase: UpdateApplicationUseCase,
    private readonly submitUseCase: SubmitApplicationUseCase,
    private readonly recordDecisionUseCase: RecordDecisionUseCase,
    private readonly assignReviewerUseCase: AssignReviewerUseCase,
    private readonly retryRiskUseCase: RetryRiskUseCase,
    private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
    private readonly encryption: FieldEncryptionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SALES)
  async create(@CurrentUser() user: JwtPayload) {
    const app = await this.createUseCase.execute(user.sub);
    return this.encryption.maskApplication(app);
  }

  @Get()
  @Roles(Role.SALES, Role.REVIEWER, Role.ADMIN)
  async list(@CurrentUser() user: JwtPayload) {
    const apps = await this.listUseCase.execute(user.sub, user.role);
    return apps.map((a) => this.encryption.maskApplication(a));
  }

  @Get('audit-logs')
  @Roles(Role.ADMIN)
  async getAuditLogs(@Query('entityId') entityId: string) {
    return this.getAuditLogsUseCase.execute(entityId);
  }

  @Get(':id')
  @Roles(Role.SALES, Role.REVIEWER, Role.ADMIN)
  async get(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const app = await this.getUseCase.execute(id, user.sub, user.role);
    return this.encryption.maskApplication(app);
  }

  @Patch(':id')
  @Roles(Role.SALES)
  async update(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: UpdateApplicationDto,
  ) {
    const app = await this.updateUseCase.execute(id, user.sub, body);
    return this.encryption.maskApplication(app);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.ACCEPTED)
  @Roles(Role.SALES)
  async submit(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const app = await this.submitUseCase.execute(id, user.sub);
    return this.encryption.maskApplication(app);
  }

  @Post(':id/decision')
  @Roles(Role.REVIEWER)
  async recordDecision(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: RecordDecisionDto,
  ) {
    const app = await this.recordDecisionUseCase.execute(id, user.sub, body.decision, body.notes);
    return this.encryption.maskApplication(app);
  }

  @Post(':id/reviewer')
  @Roles(Role.ADMIN)
  async assignReviewer(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() body: AssignReviewerDto,
  ) {
    const app = await this.assignReviewerUseCase.execute(id, body.reviewerId, user.sub);
    return this.encryption.maskApplication(app);
  }

  @Post(':id/retry-risk')
  @Roles(Role.ADMIN)
  async retryRisk(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const app = await this.retryRiskUseCase.execute(id, user.sub);
    return this.encryption.maskApplication(app);
  }
}
