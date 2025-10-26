import { AppLogger } from '@app/common';
import { TUser } from '@app/shared';
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { ApiError } from '@app/common/errors/api-error';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
  ) {}

  async login(authDto: AuthDto): Promise<TUser | undefined> {
    this.logger.warn('➡️ Start validating..', AuthService.name);
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) throw ApiError.Unathorized();

    const isVerified = await this.verify(user.password, authDto.password);
    this.logger.debug(`isVerified ${isVerified}`);
    if (!isVerified) throw ApiError.Unathorized();
    //generate token
    this.createToken();

    this.logger.debug('✅ Finish validated', AuthService.name);
    return user;
  }

  async verify(hashedPassword: string, password: string) {
    return await argon2.verify(hashedPassword, password);
  }

  createToken() {}
}
