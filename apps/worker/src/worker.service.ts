import { WORKER_UPLOAD_AVATAR } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Injectable()
export class WorkerService {
  constructor() {}

  @EventPattern(WORKER_UPLOAD_AVATAR)
  async handleUpload(@Payload() data: any) {
    console.log('from worker service');
    console.log(data);
  }
}
