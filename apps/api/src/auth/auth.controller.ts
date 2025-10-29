import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './auth.guard';
import { ApiError } from '@app/common/errors';
import { ApiResponse, COOKIE_KEY, IJwtPayload, TTL } from '@app/shared';
import {
  ApiConsumes,
  ApiCookieAuth,
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@app/common';

@ApiTags('User autentikasi')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Auntentikasi untuk mendapatkan access token' })
  @ApiHeader({
    name: 'user-agent',
    description: 'informasi user agent client',
    required: false,
  })
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Ip() ip?: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<ApiResponse> {
    const { accessToken, refreshToken } = await this.authService.login(authDto, ip, userAgent);

    return {
      message: 'Login success',
      data: { accessToken },
      setCookies: [
        {
          name: COOKIE_KEY.REFRESH_TOKEN_KEY,
          value: refreshToken,
          options: { maxAge: TTL.MSSCD_REFRESH_TOKEN },
        },
      ],
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token menggunakan cookie' })
  @ApiCookieAuth('refreshToken')
  @ApiHeader({
    name: 'user-agent',
    description: 'informasi user agent client',
    required: false,
  })
  async refreshToken(
    @Req() req: Request,
    @Ip() ip?: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<ApiResponse> {
    const token = req.cookies['refreshToken'];

    if (!token) throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Refresh token is missing');

    const { accessToken, refreshToken } = await this.authService.refreshToken(token, ip, userAgent);

    return {
      data: {
        accessToken,
      },
      setCookies: [
        {
          name: COOKIE_KEY.REFRESH_TOKEN_KEY,
          value: refreshToken,
          options: { maxAge: TTL.MSSCD_REFRESH_TOKEN },
        },
      ],
    };
  }

  @ApiOperation({ summary: 'Hapus session user (cookie & token)' })
  @ApiCookieAuth('refreshToken')
  @Post('logout')
  async logout(@Req() req: Request): Promise<ApiResponse> {
    const refreshToken = req.cookies['refreshToken'];

    const isRevoked = await this.authService.logoutByRefreshToken(refreshToken);
    return {
      clearCookies: [COOKIE_KEY.REFRESH_TOKEN_KEY],
      data: {
        isRevoked,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mengetahui jumlah token aktif dari seorang user dengan JWT.' })
  @ApiHeader({
    name: 'Autorization',
    description: 'JWT Access Token',
    example: 'Bearer yourLongToken',
    required: true,
  })
  @Get('audit')
  async findUserActiveToken(@GetUser('id') userId: number) {
    if (!userId) throw ApiError.Unathorized();
    else return await this.authService.findUserActiveToken(userId);
  }

  @ApiOperation({ summary: 'Mengetahui jumlah token aktif dari seorang user dengan params.' })
  @Get('audit/:id')
  async findUserActiveTokenByParam(@Param('id') userId: number) {
    if (!userId) throw ApiError.Unathorized();
    else return await this.authService.findUserActiveToken(userId);
  }
}
