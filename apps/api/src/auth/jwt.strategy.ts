import { EnvService } from '@app/common/config/env.config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from '@app/shared';
import { RedisService } from '@app/common';
import { ApiError } from '@app/common/errors';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    env: EnvService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.secretConfig.jwtAccessSecret!,
    });
  }
  async validate(payload: IJwtPayload) {
    const isReady = this.redisService.getClient().isReady ?? false;
    if (isReady) {
      const exists = await this.redisService.get(`access:${payload.jti}`);
      if (!exists) throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Token revoked');
    }

    return { sub: payload.sub, email: payload.email, jti: payload.jti };
  }
}
