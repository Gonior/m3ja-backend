import { Injectable, Inject } from '@nestjs/common';
import { UploadService as UploadServiceCore } from '@app/upload';
import { FileService } from '@app/file';
import { AppLogger, UploadConfigs } from '@app/common';
import { UserService } from '../user/user.service';
import { ClientProxy } from '@nestjs/microservices';
import { EVENT, IUploadEvent, WORKER_SERVICE } from '@app/shared';
@Injectable()
export class UploadService {
  constructor(
    private readonly uploadService: UploadServiceCore,
    private readonly fileService: FileService,
    private readonly userService: UserService,
    @Inject(WORKER_SERVICE) private readonly uploadClient: ClientProxy,
    private readonly logger: AppLogger,
  ) {}

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    const user = await this.userService.findById(userId);
    if (user && user.avatarKey) {
      await this.fileService.deleteFile(user.avatarKey);
    }

    const responseUpload = await this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
    const uploadEvent: IUploadEvent = {
      ...responseUpload,
      userId: user.id,
      avatarResizeStatus: 'processing',
    };
    await this.userService.updateAvatar(user.id, {
      avatarKey: uploadEvent.key,
      avatarResizeStatus: uploadEvent.avatarResizeStatus,
    });

    this.logger.debug(`🔧 Sending to worker (id :${user.id})`, UploadService.name);
    this.uploadClient.emit(EVENT.WORKER_UPLOAD_AVATAR, uploadEvent);

    return responseUpload;
  }
}
