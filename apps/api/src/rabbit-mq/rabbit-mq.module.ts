import { QUEUE, WORKER_SERVICE } from '@app/shared';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: WORKER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: QUEUE.WORKER_SERVICE_QUEUE,
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMqModule {}
