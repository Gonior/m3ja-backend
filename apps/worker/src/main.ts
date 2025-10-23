import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WORKER_UPLOAD_AVATAR } from '@app/shared';

async function bootstrap() {
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'upload_queue',
      queueOptions: { durable: true },
    },
  });
  console.log('connectiong to RabbitMQ');
  await microservice.listen();
  console.log(`worker is listening for jobs...`);
}
bootstrap();
