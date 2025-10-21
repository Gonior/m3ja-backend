import 'dotenv-flow/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter, AppLogger, LoggingInterceptor } from '@app/common';
import { ApiError } from '@app/common/errors/api-error';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // biar logger custom bisa dapat semua log
  });

  const configSwagger = new DocumentBuilder()
    .setTitle('m3ja-backend')
    .setDescription('Dokumentasi otomatis m3ja-backend API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('docs', app, document);
  // set env config
  const config = app.get(ConfigService);

  // set logger wiston
  const logger = new AppLogger();
  app.useLogger(logger);

  // validasi global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // auto hapus field yang tidak ada di DTO,
      forbidNonWhitelisted: true, // error kalo ada field "liar"
      transform: true, // auto transfrom data
      exceptionFactory: (validationErrors) => {
        const formatted = validationErrors.map((err) => ({
          field: err.property,
          message: Object.values(err.constraints ?? [])[0] ?? [],
        }));
        // format
        // {
        // ...,
        //  errors : [
        //    {
        //      field: "password",
        //      message:'password must be at least 8 characters';
        //    }
        //  ]
        //...
        //}
        return ApiError.BadRequest('Validation failed', formatted);
      },
    }),
  );

  // global error handler
  app.useGlobalFilters(new AllExceptionFilter(new AppLogger()));

  // global http logger
  app.useGlobalInterceptors(new LoggingInterceptor(new AppLogger()));

  const host = config.get<string>('app.host') || '127.0.0.1';
  const port = config.get<number>('app.apiPort') || 3000;
  try {
    await app.listen(port, host);
    logger.log(`📡 server running on port http://${host}:${port}`);
    logger.log(`📖 swagger running on port http://${host}:${port}/docs`);
  } catch (error) {
    logger.error('❌ Failed to start server', (error as Error).stack);
  }
}
bootstrap();
