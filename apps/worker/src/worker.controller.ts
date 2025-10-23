import { WORKER_UPLOAD_AVATAR, WORKER_UPLOAD_DONE } from '@app/shared';
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';

@Controller('worker')
export class WorkerController {
  constructor(@Inject('API_SERVICE') private readonly apiClient: ClientProxy) {}
  @EventPattern(WORKER_UPLOAD_AVATAR)
  async handleUpload(@Payload() data: any) {
    console.log({ from: 'worker', data });
    data.key = 'key baru';
    setTimeout(() => {
      this.apiClient.emit(WORKER_UPLOAD_DONE, data);
    }, 5000);
  }
}
