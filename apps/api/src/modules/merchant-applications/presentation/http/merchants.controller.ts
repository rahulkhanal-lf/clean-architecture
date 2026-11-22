import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { FieldEncryptionService } from '../../infrastructure/services/field-encryption.service.js';
import { UpdateApplicationDto } from './dtos/update-application.dto.js';

@ApiTags('merchants')
@ApiBearerAuth()
@Controller('merchants')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.SALES)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class MerchantsController {
  constructor(
    private readonly createUseCase: CreateApplicationUseCase,
    private readonly getUseCase: GetApplicationUseCase,
    private readonly listUseCase: ListApplicationsUseCase,
    private readonly updateUseCase: UpdateApplicationUseCase,
    private readonly submitUseCase: SubmitApplicationUseCase,
    private readonly encryption: FieldEncryptionService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: JwtPayload) {
    const app = await this.createUseCase.execute(user.sub);
    return this.encryption.maskApplication(app);
  }

  @Get()
  async list(@CurrentUser() user: JwtPayload) {
    const apps = await this.listUseCase.execute(user.sub);
    return apps.map((a) => this.encryption.maskApplication(a));
  }

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const app = await this.getUseCase.execute(id, user.sub);
    return this.encryption.maskApplication(app);
  }

  @Patch(':id')
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
  async submit(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const app = await this.submitUseCase.execute(id, user.sub);
    return this.encryption.maskApplication(app);
  }
}
