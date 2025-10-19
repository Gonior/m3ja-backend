import { AppLogger, userTable } from '@app/common';
import { DB_PROVIDER, TUser } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { AuthDto } from './dto/auth.dto';
import { ApiError } from '@app/common/errors/api-error';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DB_PROVIDER) private readonly db: ReturnType<typeof drizzle>,
    private readonly logger: AppLogger,
    private readonly userService: UsersService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async login(authDto: AuthDto): Promise<TUser | undefined> {
    this.logger.log('start validating..');
    let user = await this.userService.findByEmail(authDto.email);
    if (!user) throw ApiError.NotFound('email not found');
    if (user?.password !== authDto.password) throw ApiError.Unathorized('credential is not valid');
    //generate token
    this.createToken();

    this.logger.log('finish validated');
    return user;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log('start call register()');
    let user = this.userService.createUser(createUserDto);
    if (!user) throw ApiError.BadRequest('Can not register account');
    // generate token
    this.createToken();
    this.logger.log('register() is called');

    return user;
  }

  createToken() {}
}
