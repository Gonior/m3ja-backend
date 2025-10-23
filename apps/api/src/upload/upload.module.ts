import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadBridgeService } from './upload-bridge.service';
import { LocalUploadService } from './local-upload.service';
import { R2UploadService } from './r2-upload.service';

@Module({
  providers: [UploadBridgeService, LocalUploadService, R2UploadService],
  controllers: [UploadController],
  exports: [UploadBridgeService],
})
export class UploadModule {}
