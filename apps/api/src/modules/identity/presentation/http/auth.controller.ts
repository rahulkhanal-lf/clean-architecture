import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';
import { LoginUseCase } from '../../application/use-cases/login.use-case.js';
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case.js';
import { JwtGuard } from '../../guards/jwt.guard.js';
import { LocalAuthGuard } from '../../guards/local-auth.guard.js';
import { User } from '../../domain/user.js';
import { LoginDto } from './dtos/login.dto.js';
import { RefreshDto } from './dtos/refresh.dto.js';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshUseCase: RefreshUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  login(@Request() req: ExpressRequest & { user: User }) {
    return this.loginUseCase.execute(req.user);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshDto) {
    return this.refreshUseCase.execute(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  logout() {
    // Client discards tokens. Stateless — no server-side revocation.
  }
}
