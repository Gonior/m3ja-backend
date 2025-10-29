import 'dotenv-flow/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter, AppLogger, LoggingInterceptor } from '@app/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { EnvService } from '@app/common/config/env.config.service';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { QUEUE } from '@app/shared';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from '@app/common/inteceptors/response.interceptor';
import { ClsUserInterceptor } from '@app/common/inteceptors/cls-user.interceptor';
import { ClsService } from 'nestjs-cls';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true, // biar logger custom bisa dapat semua log
  });

  const config = app.get(EnvService);
  const logger = app.get(AppLogger);
  const clsService = app.get(ClsService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.rabbitmqConfig.url],
      queue: QUEUE.API_SERVICE_QUEUE,
      queueOptions: { durable: true },
    },
  });
  // konfigurasi swagger
  const configSwagger = new DocumentBuilder()
    .setTitle('m3ja-backend')
    .setDescription('Dokumentasi otomatis m3ja-backend API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);

  app.use(cookieParser());
  app.useLogger(logger);
  // picu onModuleDestroy()
  app.enableShutdownHooks();

  // global error handler
  app.useGlobalFilters(new AllExceptionFilter(logger));

  // global http logger
  app.useGlobalInterceptors(new ResponseInterceptor(config));
  app.useGlobalInterceptors(new ClsUserInterceptor(clsService));
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const host = config.appConfig.host || '127.0.0.1';
  const port = config.appConfig.apiPort || 3000;
  try {
    await app.startAllMicroservices();
    await app.listen(port, host);

    logger.log(`📡 server running on port http://${host}:${port}`);
    logger.log(`📖 swagger running on port http://${host}:${port}/docs`);
  } catch (error) {
    logger.error('❌ Failed to start server', (error as Error).stack);
  }
}
bootstrap();
