import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  const configService = app.get(ConfigService);
  const host = configService.get<string>('HOST') ?? '127.0.0.1';
  const port = configService.get<number>('WORKER_PORT') ?? 3001;
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(WorkerModule, {
    transport: Transport.TCP,
    options: {
      host,
      port,
    },
  });
  await microservice.listen();
  console.log(`microservice running on tcp://${host}:${port}`);
}
bootstrap();
