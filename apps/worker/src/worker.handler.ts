import { EVENT, type IUploadEvent } from '@app/shared';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { ResizeImageAvatarService } from './resize-image/resize-image-avatar.service';
import { AppLogger } from '@app/common';

@Controller()
export class WorkerHandler {
  constructor(
    @Inject('API_SERVICE') private readonly apiClient: ClientProxy,
    private readonly resizeImageService: ResizeImageAvatarService,
    private readonly logger: AppLogger,
  ) {}
  @EventPattern(EVENT.WORKER_UPLOAD_AVATAR)
  async handleUpload(@Payload() data: IUploadEvent) {
    this.logger.debug(`➡️ Receive avatar from API (id: ${data.userId})`, WorkerHandler.name);
    // const userId = data.userId;
    let newData = await this.resizeImageService.resizeImage(data);

    this.logger.log(
      `✅ Send back avatar (${newData?.avatarResizeStatus}) to API (id: ${newData?.userId})`,
      WorkerHandler.name,
    );
    this.apiClient.emit(EVENT.WORKER_UPLOAD_DONE, newData);
  }
}
