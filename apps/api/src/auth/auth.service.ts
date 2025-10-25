import { AppLogger, userTable } from '@app/common';
import { DB_PROVIDER, TUser } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import { ApiError } from '@app/common/errors/api-error';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UsersService,
  ) {}

  async login(authDto: AuthDto): Promise<TUser | undefined> {
    this.logger.log('start validating..');
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) throw ApiError.Unathorized();
    if (user?.password !== authDto.password) throw ApiError.Unathorized();
    //generate token
    this.createToken();

    this.logger.log('finish validated');
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log('start call register()');
    const user = this.userService.createUser(createUserDto);
    if (!user) throw ApiError.BadRequest('REGISTER_ACCOUNT_ERROR');
    // generate token
    this.createToken();
    this.logger.log('register() is called');

    return user;
  }

  createToken() {}
}
