import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BaseValidationPipe, CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@app/common';
import { UploadModule } from './upload/upload.module';
import { APP_PIPE } from '@nestjs/core';
import { MulterMaxSizeMiddleware } from '@app/common/middleware/multer-maxsize.middleware';
import { RegistrationModule } from './registration/registration.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';
import { FileModule } from './file/file.module';
import { FileModule as FileModuleCore } from '@app/file';
import { UploadModule as UploadModuleCore } from '@app/upload';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    AuthModule,
    ConfigModule,
    RegistrationModule,
    RabbitMqModule,
    UploadModule,
    UploadModuleCore,
    FileModule,
    FileModuleCore,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: BaseValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MulterMaxSizeMiddleware).forRoutes('upload', 'register');
  }
}
