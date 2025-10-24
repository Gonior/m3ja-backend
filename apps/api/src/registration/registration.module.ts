import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { UsersModule } from '../users/users.module';
import { UploadModule } from '@app/upload';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { RegistrationHandler } from './registration.handler';

@Module({
  imports: [UploadModule, UsersModule, RabbitMqModule],
  providers: [RegistrationService],
  controllers: [RegistrationController, RegistrationHandler],
})
export class RegistrationModule {}
