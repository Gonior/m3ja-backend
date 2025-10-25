import { Module } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { RegistrationController } from './registration.controller';
import { UserModule } from '../user/user.module';
import { UploadModule } from '@app/upload';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { RegistrationHandler } from './registration.handler';

@Module({
  imports: [UploadModule, UserModule, RabbitMqModule],
  providers: [RegistrationService],
  controllers: [RegistrationController, RegistrationHandler],
})
export class RegistrationModule {}
