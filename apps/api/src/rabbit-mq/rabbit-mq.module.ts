import { EnvService } from '@app/common/config/env.config.service';
import { QUEUE, WORKER_SERVICE } from '@app/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: WORKER_SERVICE,
        inject: [EnvService],
        useFactory: (env: EnvService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [env.rabbitmqConfig.url],
            queue: QUEUE.WORKER_SERVICE_QUEUE,
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
