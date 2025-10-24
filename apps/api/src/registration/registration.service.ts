import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { ApiError } from '@app/common/errors';
import * as argon2 from 'argon2';
import { EnvService } from '@app/common/config/env.config.service';
import { AppLogger, UploadConfigs } from '@app/common';
import { IUploadFileResponse, WORKER_SERVICE, EVENT } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { UploadService } from '@app/upload';
@Injectable()
export class RegistrationService {
  constructor(
    private readonly userService: UsersService,
    private readonly uploadService: UploadService,
    private readonly envService: EnvService,
    private readonly logger: AppLogger,
    @Inject(WORKER_SERVICE) private readonly uploadClient: ClientProxy,
  ) {
    this.logger.setContext(RegistrationService.name);
  }

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    let responseFile: IUploadFileResponse;

    let existsUser = await this.userService.findByEmail(createUserDto.email);
    if (existsUser) throw ApiError.BadRequest('ALREADY_EXISTS', { field: 'email' });
    // hash password with default setting
    let hashedPassword = await argon2.hash(createUserDto.password);

    createUserDto.password = hashedPassword;
    // save to database
    let user = await this.userService.createUser(createUserDto);
    if (!user) throw ApiError.BadRequest('REGISTER_ACCOUNT_ERROR');
    if (file) {
      responseFile = await this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
      if (responseFile) {
        responseFile.key = responseFile.key;
        await this.userService.updateAvatar(user.id, responseFile.key);
        this.logger.debug(`send avatar data to worker with user id ${user.id}`);
        this.uploadClient.emit(EVENT.WORKER_UPLOAD_AVATAR, {
          userId: user.id,
          ...responseFile,
        });
      }
    }
    return {
      success: true,
      message: 'user created!',
    };
  }
}
