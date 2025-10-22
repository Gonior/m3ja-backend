import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
import { UploadConfigs } from './upload.config';
import { AppLogger, FileValidationPipe } from '@app/common';
import { ApiError } from '@app/common/errors';
import { type IUploadService, UPLOAD_SERVICE } from '@app/shared';
import type { Response, Request } from 'express';
import { Readable } from 'stream';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UPLOAD_SERVICE) private readonly uploadService: IUploadService,
    private readonly logger: AppLogger,
  ) {}

  @Get('*path')
  async getFile(@Param('path') path: string, @Res() res: Response) {
    let key = path.replaceAll(',', '/');

    let data = await this.uploadService.getFile(key);

    if (!data) {
      throw ApiError.NotFound();
    }

    res.setHeader('Content-Type', data.ContentType || 'pplication/octet-stream');
    (data.Body as Readable).pipe(res);
  }

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
