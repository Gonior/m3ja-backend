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
import { AppLogger, FileValidationPipe, UploadConfigs, UploadType } from '@app/common';
import { ApiError } from '@app/common/errors';
import { type IUploadService, UPLOAD_SERVICE } from '@app/shared';
import type { Response } from 'express';
import { Readable } from 'stream';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(UPLOAD_SERVICE) private readonly uploadService: IUploadService,
    private readonly logger: AppLogger,
  ) {}

  @Get('*path')
  async getFile(@Param('path') path: string[], @Res() res: Response) {
    console.log(path);
    let key = path.join('/');

    let data = await this.uploadService.getFile(key);

    if (!data) {
      throw ApiError.NotFound();
    }

    res.setHeader('Content-Type', data.ContentType || 'pplication/octet-stream');
    (data.Body as Readable).pipe(res);
  }

  @Post('avatar')
  @UploadType({ type: 'avatar' })
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (file) return this.uploadService.saveFile(file, UploadConfigs.avatar.folder);

    return 'kamu testing aja ya?';
  }

  @Post('document')
  @UploadType({ type: 'document', optional: true })
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (file) return this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
    return 'testing?';
  }
}
