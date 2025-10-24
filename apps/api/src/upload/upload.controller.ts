import { Controller, Post, UploadedFile } from '@nestjs/common';
import { AppLogger, FileValidationPipe, UploadConfigs, UploadType } from '@app/common';
import { UploadService } from '@app/upload';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly logger: AppLogger,
  ) {}

  @Post('avatar')
  @UploadType({ type: 'avatar' })
  async uploadAvatar(
    @UploadedFile(new FileValidationPipe({ ...UploadConfigs.avatar, optional: false }))
    file: Express.Multer.File,
  ) {
    // console.log(file);
    if (file) return this.uploadService.saveFile(file, UploadConfigs.avatar.folder);

    return 'kamu testing aja ya?';
  }

  @Post('document')
  @UploadType({ type: 'document' })
  async uploadDocument(
    @UploadedFile(new FileValidationPipe({ ...UploadConfigs.document, optional: false }))
    file: Express.Multer.File,
  ) {
    if (file) return this.uploadService.saveFile(file, UploadConfigs.document.folder);
    return 'testing?';
  }
}
