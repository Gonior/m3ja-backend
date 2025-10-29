import { AppLogger, RedisService } from '@app/common';
import { IJwtPayload, TTL } from '@app/shared';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { ApiError } from '@app/common/errors/api-error';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { EnvService } from '@app/common/config/env.config.service';
import { UserTokenRepository } from './user-token/user-token.repository';
import { randomBytes, UUID } from 'crypto';

// ini akan sedikit panjang dan membingungkan
// tapi secara gari besar :
// 1) akses aplikasi hanya bisa menggunakan access token dengan masa pakai yang sangat singkat
// untuk membuat access token kamu punya 2 cara : (1) login ulang atau (2) fetch ke /auth/refresh dengan membawa refresh token di cookie
// 2) adalah refresh token dengan masa pakai yang panjang.
// refresh token adalah kunci asli mu, ini bisa dipakai untuk membuat banyak access token
// untuk membuat refreh token hanya ada 1 : login aplikasi aja.
// 3) session id adalah id unik tiap aktifitas login.
// jadi 1 user bisa login di banyak device dengan masing-masing session id

@Injectable()
export class AuthService {
  private ACCESS_KEY = (sessionId: string) => `session:${sessionId}:access`;
  private REFRESH_KEY = (sessionId: string) => `session:${sessionId}:refresh`;

  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    private readonly env: EnvService,
    private readonly redisService: RedisService,
    private readonly tokenRepo: UserTokenRepository,
  ) {}

  // Sign helpers
  private async signAccessToken(payload: IJwtPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.env.secretConfig.jwtAccessSecret,
      expiresIn: TTL.STR_ACCESS_TOKEN,
    });
  }

  private async signRefreshToken(payload: IJwtPayload) {
    return await this.jwt.signAsync(payload, {
      secret: this.env.secretConfig.jwtAccessSecret,
      expiresIn: TTL.STR_REFRESH_TOKEN,
    });
  }

  //
  async login(authDto: AuthDto, ipAddress?: string, userAgent?: string) {
    this.logger.warn('➡️ Start login..', AuthService.name);
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) throw ApiError.Unathorized();

    const isVerified = await argon2.verify(user.password, authDto.password);

    if (!isVerified) throw ApiError.Unathorized();

    //generate token
    const { accessToken, refreshToken } = await this.createToken(
      user.id,
      user.email,
      ipAddress,
      userAgent,
    );

    return { success: true, accessToken, refreshToken };
  }

  async refreshToken(token: string, ipAddress?: string, userAgent?: string) {
    let payload: IJwtPayload;
    this.logger.debug('Start validating token', AuthService.name);
    try {
      payload = await this.jwt.verifyAsync<IJwtPayload>(token);
    } catch (error) {
      this.logger.error(error.message);
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Invalid refresh token');
    }

    const { sessionId, jti: refreshTokenJti } = payload;

    // cache ke redis
    const storedRefreshTokenJti = await this.redisService.get(this.REFRESH_KEY(sessionId));
    if (!storedRefreshTokenJti || storedRefreshTokenJti !== refreshTokenJti) {
      await this.tokenRepo.revokeToken(refreshTokenJti).catch(() => null);
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Token invalid for session');
    }
    // fallback ke database
    const dbRecord = await this.tokenRepo.findOneJtiActiveToken(refreshTokenJti);
    if (!dbRecord)
      throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Refresh token not found or revoked');

    // buat token baru
    const { refreshToken, accessToken } = await this.createToken(
      payload.sub,
      payload.email,
      ipAddress,
      userAgent,
    );

    //revoke token lama
    await this.revokeSession(sessionId);
    return { success: true, accessToken, refreshToken };
  }

  async createToken(userId: number, email: string, ipAddress?: string, userAgent?: string) {
    const refreshTokenJti = uuid() as UUID;
    const accessTokenJti = uuid() as UUID;
    const sessionId = randomBytes(10).toString('hex');

    const accessToken = await this.signAccessToken({
      sub: userId,
      email,
      sessionId,
      jti: accessTokenJti,
    });

    const refreshToken = await this.signRefreshToken({
      sub: userId,
      email,
      sessionId,
      jti: refreshTokenJti,
    });

    try {
      await this.redisService.set(this.ACCESS_KEY(sessionId), accessTokenJti, {
        EX: TTL.SCD_ACCESS_TOKEN,
      });
      await this.redisService.set(this.REFRESH_KEY(sessionId), refreshTokenJti, {
        EX: TTL.SCD_REFRESH_TOKEN,
      });

      this.tokenRepo.saveToken({
        userId,
        ipAddress,
        userAgent,
        sessionId,
        jti: refreshTokenJti,
        token: refreshToken,
        expiresAt: new Date(Date.now() + TTL.MSSCD_REFRESH_TOKEN),
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ApiError.Internal('DB_UNKNOW_ERROR', undefined, 'Error during save token');
    }

    return {
      sessionId,
      accessToken,
      refreshToken,
      refreshTokenJti,
      accessTokenJti,
    };
  }

  async revokeSession(sessionId: string) {
    const storedRefreshJti = (await this.redisService.get(this.REFRESH_KEY(sessionId))) as UUID;
    if (storedRefreshJti) {
      await this.tokenRepo
        .revokeToken(storedRefreshJti)
        .catch((error) => this.logger.error(error.message));
    }
    await this.redisService.del(this.ACCESS_KEY(sessionId));
    await this.redisService.del(this.REFRESH_KEY(sessionId));
  }

  async logoutByRefreshToken(refreshToken: string) {
    let isRevoked = false;
    let payload: IJwtPayload;

    try {
      payload = await this.jwt.verifyAsync<IJwtPayload>(refreshToken);
      await this.revokeSession(payload.sessionId);
      await this.tokenRepo.revokeToken(payload.jti).catch(() => null);
      isRevoked = true;
    } catch (error) {
      this.logger.error(error);
    }
    this.logger.log(`token is (${isRevoked}) revoked`, AuthService.name);

    return isRevoked;
  }

  async findUserActiveToken(userId: number) {
    return await this.tokenRepo.findUserActiveToken(userId);
  }
}
