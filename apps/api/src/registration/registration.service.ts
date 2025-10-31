import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiError } from '@app/common/errors';
import { AppLogger } from '@app/common';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: AppLogger,
  ) {}

  async register(createUserDto: CreateUserDto) {
    this.logger.debug(`➡️ Start register user...`, RegistrationService.name);

    let user = await this.userService.registerUser(createUserDto);
    if (!user) throw ApiError.BadRequest('REGISTER_ACCOUNT_ERROR');

    this.logger.log(`✅ User registered successfully (id: ${user.id})`, RegistrationService.name);
    return {
      message: 'User created!',
      data: user,
    };
  }
}
