import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadModule as UploadModuleCore } from '@app/upload';
import { RabbitMqModule } from '../rabbit-mq/rabbit-mq.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [RabbitMqModule, UserModule],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
