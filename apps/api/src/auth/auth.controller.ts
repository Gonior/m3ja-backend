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
import { IJwtPayload } from '@app/shared';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res() res: Response,
  ) {
    const { success, accessToken, refreshToken } = await this.authService.login(
      authDto,
      ip,
      userAgent,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax', // aman buat FE di domain sama,
    });
    res.status(200).json({ success, accessToken });
  }

  @Post('refresh')
  async refreshToken(
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies['refreshToken'];

    if (!token) throw ApiError.Unathorized('UNAUTHORIZED', undefined, 'Refresh token is missing');

    const { success, accessToken, refreshToken } = await this.authService.refreshToken(
      token,
      ip,
      userAgent,
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax', // aman buat FE di domain sama,
    });
    res.status(200).json({ success, accessToken });
  }
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['refreshToken'];
    const payload = req?.user as IJwtPayload;
    const isRevoked = await this.authService.logout(token, payload.jti);
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, isRevoked });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @Get('audit/:id')
  async findUserActiveToken(@Param('id') id: number) {
    return await this.authService.findUserActiveToken(id);
  }
}
