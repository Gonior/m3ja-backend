import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerHandler } from './worker.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUE } from '@app/shared';
import { ResizeImageAvatarService } from './resize-image/resize-image-avatar.service';
import { UploadModule } from '@app/upload';
import { FileModule } from '@app/file';

@Module({
  imports: [
    CommonModule,
    ClientsModule.register([
      {
        name: 'API_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: QUEUE.API_SERVICE_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
    UploadModule,
    FileModule,
    CommonModule,
  ],
  controllers: [WorkerHandler],
  providers: [WorkerService, ClientsModule, ResizeImageAvatarService],
})
export class WorkerModule {}
