import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user-dto';
import { ApiError } from '@app/common/errors';
import * as argon2 from 'argon2';
import { AppLogger, UploadConfigs } from '@app/common';
import { IUploadFileResponse, WORKER_SERVICE, EVENT } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
import { UploadService } from '@app/upload';
@Injectable()
export class RegistrationService {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
    private readonly logger: AppLogger,
    @Inject(WORKER_SERVICE) private readonly uploadClient: ClientProxy,
  ) {}

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    this.logger.debug(`➡️ Start register user...`, RegistrationService.name);
    let responseFile: IUploadFileResponse;

    let user = await this.userService.registerUser(createUserDto);
    if (!user) throw ApiError.BadRequest('REGISTER_ACCOUNT_ERROR');

    if (file) {
      this.logger.debug(`🔧 Avatar detected...`, RegistrationService.name);
      responseFile = await this.uploadService.saveFile(file, UploadConfigs.avatar.folder);

      if (responseFile) {
        responseFile.key = responseFile.key;
        await this.userService.updateAvatar(user.id, responseFile.key);

        this.logger.debug(`🔧 Sending to worker (id :${user.id})`, RegistrationService.name);
        this.uploadClient.emit(EVENT.WORKER_UPLOAD_AVATAR, {
          userId: user.id,
          ...responseFile,
        });
      }
    }
    this.logger.log(`✅ User registered successfully (id: ${user.id})`, RegistrationService.name);
    return {
      success: true,
      message: 'user created!',
      user,
    };
  }
}
