import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { CommonModule } from '@app/common';
import { LocalFileService } from './local-file.service';
import { R2FileService } from './r2-file.service';

@Global()
@Module({
  imports: [CommonModule],
  providers: [FileService, LocalFileService, R2FileService],
  exports: [FileService],
})
export class FileModule {}
