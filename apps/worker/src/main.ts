import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUE } from '@app/shared';
import { AppLogger } from '@app/common';

async function bootstrap() {
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
    bufferLogs: true,
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: QUEUE.WORKER_SERVICE_QUEUE,
      queueOptions: { durable: true },
    },
  });

  const logger = microservice.get(AppLogger);
  microservice.useLogger(logger);
  logger.log('🚀 Connectiong to RabbitMQ...');
  await microservice.listen();
  logger.log(`👂 Worker is listening for jobs...`);
}
bootstrap();
