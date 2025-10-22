import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BaseValidationPipe, CommonModule } from '@app/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@app/common';
import { UploadModule } from './upload/upload.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [UsersModule, CommonModule, AuthModule, ConfigModule, UploadModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: BaseValidationPipe,
    },
  ],
})
export class AppModule {}
