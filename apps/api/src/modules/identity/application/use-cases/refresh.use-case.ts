import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../domain/role.enum.js';
import { TokenPair } from './login.use-case.js';

interface RefreshPayload {
  sub: string;
  role: Role;
  type: string;
}

@Injectable()
export class RefreshUseCase {
  constructor(private readonly jwtService: JwtService) {}

  execute(refreshToken: string): TokenPair {
    let payload: RefreshPayload;
    try {
      payload = this.jwtService.verify<RefreshPayload>(refreshToken, {
        secret: process.env['JWT_REFRESH_SECRET'] ?? 'refresh-change-me-in-production',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }

    const accessPayload = { sub: payload.sub, role: payload.role };
    return {
      accessToken: this.jwtService.sign(accessPayload, { expiresIn: '15m' }),
      refreshToken: this.jwtService.sign(
        { ...accessPayload, type: 'refresh' },
        {
          secret: process.env['JWT_REFRESH_SECRET'] ?? 'refresh-change-me-in-production',
          expiresIn: '7d',
        },
      ),
    };
  }
}
