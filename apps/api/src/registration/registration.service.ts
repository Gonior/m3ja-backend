import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user-dto';
import { ApiError } from '@app/common/errors';
import bycrpt from 'bcrypt';
import { EnvService } from '@app/common/config/env.config.service';
import { UploadConfigs } from '@app/common';
import { UploadBridgeService } from '../upload/upload-bridge.service';
import { IUploadFileResponse, WORKER_SERVICE, WORKER_UPLOAD_AVATAR } from '@app/shared';
import { ClientProxy } from '@nestjs/microservices';
@Injectable()
export class RegistrationService {
  constructor(
    private readonly userService: UsersService,
    private readonly uploadService: UploadBridgeService,
    private readonly envService: EnvService,
    @Inject(WORKER_SERVICE) private readonly uploadClient: ClientProxy,
  ) {}

  async register(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    let responseFile: IUploadFileResponse;

    // let existsUser = await this.userService.findByEmail(createUserDto.email);
    // if (existsUser) throw ApiError.BadRequest('ALREADY_EXISTS', { field: 'email' });

    // let hashedPassword = await bycrpt.hash(
    //   createUserDto.password,
    //   this.envService.secretConfig.salt || 10,
    // );
    // createUserDto.password = hashedPassword;
    // // save to database
    // let user = await this.userService.createUser(createUserDto);
    // if (!user) throw ApiError.BadRequest('REGISTER_ACCOUNT_ERROR');
    if (file) {
      // responseFile = await this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
      this.uploadClient.emit(WORKER_UPLOAD_AVATAR, {
        userId: 1,
        key: 'inikey',
        mimeType: 'jpg',
      });
    }
    return {
      success: true,
      message: 'user created!',
    };
  }
}
