import { Body, Controller, Inject, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// import { memoryStorage } from 'multer';
import { UploadConfigs } from './upload.config';
import { FileValidationPipe } from '@app/common';
import { type IUploadService, UPLOAD_SERVICE } from '@app/shared';
@Controller('upload')
export class UploadController {
  constructor(@Inject(UPLOAD_SERVICE) private readonly uploadService: IUploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      // validasi jenis dan ukuran file
      new FileValidationPipe({
        maxSize: UploadConfigs.avatar.maxSize,
        allowedTypes: UploadConfigs.avatar.allowedTypes,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: UploadConfigs.document.maxSize,
        allowedTypes: UploadConfigs.document.allowedTypes,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadService.saveFile(file, UploadConfigs.document.folder);
  }
}
