import { AppLogger, RedisService } from '@app/common';
import { IJwtPayload, TNewUserToken, TTL, TUser } from '@app/shared';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { ApiError } from '@app/common/errors/api-error';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { EnvService } from '@app/common/config/env.config.service';
import { UserTokenRepository } from './user-token/user-token.repository';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly env: EnvService,
    private readonly redisService: RedisService,
    private readonly tokenRepo: UserTokenRepository,
  ) {}

  async login(authDto: AuthDto, ipAddress: string, userAgent: string) {
    this.logger.warn('➡️ Start login..', AuthService.name);
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) throw ApiError.Unathorized();

    const isVerified = await argon2.verify(user.password, authDto.password);

    if (!isVerified) throw ApiError.Unathorized();

    //generate token
    const { accessToken, refreshToken, refreshTokenJti, accessTokenJti } = await this.createToken(
      user.id,
      user.email,
    );

    await this.saveToken({
      expiresAt: new Date(Date.now() + TTL.MSSCD_REFRESH_TOKEN),
      ipAddress,
      userAgent,
      userId: user.id,
      jti: refreshTokenJti,
      token: refreshToken,
      accessTokenJti,
    });
    return { success: true, accessToken, refreshToken };
  }

  async refreshToken(token: string, ipAddress?: string, userAgent?: string) {
    const { valid, payload } = await this.validate(token);
    console.log({ valid, payload });
    if (!valid || !payload)
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Token is not valid or expires');
    // buat token baru
    const { refreshToken, accessToken, accessTokenJti, refreshTokenJti } = await this.createToken(
      payload.sub,
      payload.email,
    );
    await this.saveToken({
      expiresAt: new Date(Date.now() + TTL.MSSCD_REFRESH_TOKEN),
      ipAddress,
      userAgent,
      userId: payload.sub,
      jti: refreshTokenJti,
      token: refreshToken,
      accessTokenJti,
    });

    //revoke token lama
    await this.revokeToken(payload.jti);
    return { success: true, accessToken, refreshToken };
  }
  async logout(token: string, accessTokenJti: UUID) {
    const { payload } = await this.validate(token);
    let isRevoked = false;
    if (payload?.jti) isRevoked = await this.revokeToken(payload?.jti, accessTokenJti);
    this.logger.log(`token ${token} is revoked (${isRevoked})`, AuthService.name);
    return isRevoked;
  }

  async validate(token: string) {
    try {
      this.logger.debug('Start vaidating token', AuthService.name);
      const payload: IJwtPayload = await this.jwt.verifyAsync(token, {
        secret: this.env.secretConfig.jwtRefreshSecret,
      });
      this.logger.debug(
        `Get payload ${payload ? JSON.stringify(payload) : ''}...`,
        AuthService.name,
      );
      // cache ke redis
      this.logger.debug('Redis check', AuthService.name);
      const exists = await this.redisService.get(`refresh:${payload.jti}`);
      if (exists) return { valid: true, payload };

      // fallback ke database
      this.logger.debug('Fallback to database...', AuthService.name);
      const record = await this.tokenRepo.findByJti(payload.jti);
      this.logger.debug(`Get record ${record ? JSON.stringify(record) : ''}...`, AuthService.name);
      if (record) return { valid: true, payload };

      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  async createToken(userId: number, email: string) {
    const refreshTokenJti = uuid() as UUID;
    const accessTokenJti = uuid() as UUID;
    const accessToken = await this.jwt.signAsync(
      { sub: userId, email, jti: accessTokenJti },
      { secret: this.env.secretConfig.jwtAccessSecret, expiresIn: TTL.STR_ACCESS_TOKEN },
    );
    const refreshToken = await this.jwt.signAsync(
      { sub: userId, email, jti: refreshTokenJti },
      { secret: this.env.secretConfig.jwtRefreshSecret, expiresIn: TTL.STR_REFRESH_TOKEN },
    );

    return { accessToken, refreshToken, refreshTokenJti, accessTokenJti };
  }

  async saveToken(newUserToken: TNewUserToken & { accessTokenJti: UUID }) {
    try {
      await this.redisService.set(`refresh:${newUserToken.jti}`, newUserToken.userId, {
        EX: TTL.SCD_REFRESH_TOKEN,
      });

      await this.redisService.set(`access:${newUserToken.accessTokenJti}`, newUserToken.userId, {
        EX: TTL.SCD_ACCESS_TOKEN,
      });
      await this.tokenRepo.saveToken(newUserToken);
    } catch (error) {
      this.logger.error(error.message);
      throw ApiError.Internal('DB_UNKNOW_ERROR', undefined, 'Error during save token');
    }
  }

  async revokeToken(refreshTokenJti: UUID, accessTokenJti?: UUID) {
    try {
      await this.redisService.del(`refresh:${refreshTokenJti}`);
      if (accessTokenJti) await this.redisService.del(`access:${accessTokenJti}`);

      await this.tokenRepo.revokeToken(refreshTokenJti);
      this.logger.debug('Revoke token successfully', AuthService.name);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
  async findUserActiveToken(userId: number) {
    return await this.tokenRepo.findUserActiveToken(userId);
  }
}
