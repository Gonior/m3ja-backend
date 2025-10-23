import { Controller, Get, Param, Post, Res, UploadedFile } from '@nestjs/common';
import { AppLogger, UploadConfigs, UploadType } from '@app/common';
import type { Response } from 'express';
import { Readable } from 'stream';
import { UploadBridgeService } from './upload-bridge.service';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadBridgeService,
    private readonly logger: AppLogger,
  ) {}

  // @Get('*path')
  // async getFile(@Param('path') path: string[], @Res() res: Response) {

  //   let key = path.join('/');

  //   let data = await this.uploadService.getFile(key);

  //   if (!data) {
  //     throw ApiError.NotFound();
  //   }

  //   res.setHeader('Content-Type', data.ContentType || 'pplication/octet-stream');
  //   (data.Body as Readable).pipe(res);
  // }

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
  @UploadType({ type: 'document' })
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (file) return this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
    return 'testing?';
  }
}
