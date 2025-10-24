import { Global, Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { LocalUploadService } from './local-upload.service';
import { R2UploadService } from './r2-upload.service';
import { CommonModule } from '@app/common';

@Global()
@Module({
  imports: [CommonModule],
  providers: [UploadService, LocalUploadService, R2UploadService],
  exports: [UploadService],
})
export class UploadModule {}
