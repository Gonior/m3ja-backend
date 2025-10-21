import { Module } from '@nestjs/common';
import { LocalUploadService } from './local-upload.service';
import { R2UploadService } from './r2-upload.service';
import { UploadController } from './upload.controller';

import { UPLOAD_SERVICE } from '@app/shared';

@Module({
  providers: [
    {
      provide: UPLOAD_SERVICE,
      useClass: process.env.NODE_ENV === 'production' ? R2UploadService : LocalUploadService,
    },
  ],
  controllers: [UploadController],
  exports: [UPLOAD_SERVICE],
})
export class UploadModule {}
