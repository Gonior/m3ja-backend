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
    this.logger.debug(
      `receive avatar data from API with user id ${data.userId}`,
      WorkerHandler.name,
    );
    const userId = data.userId;
    let newData = (await this.resizeImageService.resizeImage(data)) as IUploadEvent;
    newData.userId = userId;
    this.logger.debug(`send avatar data to API with user id ${newData.userId}`, WorkerHandler.name);
    this.apiClient.emit(EVENT.WORKER_UPLOAD_DONE, newData);
  }
}
