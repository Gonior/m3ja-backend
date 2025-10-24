import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadModule as UploadModuleCore } from '@app/upload';
@Module({
  providers: [UploadModuleCore],
  controllers: [UploadController],
})
export class UploadModule {}
