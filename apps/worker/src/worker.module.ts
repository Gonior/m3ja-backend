import { CommonModule } from '@app/common';
import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerHandler } from './worker.handler';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QUEUE } from '@app/shared';
import { ResizeImageAvatarService } from './resize-image/resize-image-avatar.service';
import { UploadModule } from '@app/upload';
import { FileModule } from '@app/file';
import { EnvService } from '@app/common/config/env.config.service';

@Module({
  imports: [
    CommonModule,
    ClientsModule.registerAsync([
      {
        name: 'API_SERVICE',
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.rabbitmqConfig.url],
            queue: QUEUE.API_SERVICE_QUEUE,
            queueOptions: { durable: true },
          },
        }),
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
