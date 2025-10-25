import { AppLogger } from '@app/common';
import { FileService } from '@app/file';
import { IUploadFileResponse } from '@app/shared';
import { UploadService } from '@app/upload';
import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { Readable } from 'stream';
@Injectable()
export class ResizeImageAvatarService {
  constructor(
    private readonly fileService: FileService,
    private readonly uploadService: UploadService,
    private readonly logger: AppLogger,
  ) {}
  async resizeImage(data: IUploadFileResponse) {
    this.logger.debug('start resize image', 'ResizeImage');
    const { stream } = await this.fileService.getFile(data.key);

    try {
      const inputStream = await this.streamToBuffer(stream);
      const resizeBuffer = await sharp(inputStream)
        .resize(500, 500, { fit: 'cover' })
        .webp({ quality: 80 })
        .toBuffer();

      const file: Express.Multer.File = {
        mimetype: data.mimeType,
        encoding: '7bit',
        size: resizeBuffer.length,
        buffer: resizeBuffer,
        originalname: data.originalName,
        fieldname: '',
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };
      const newResponseUploadFile = await this.uploadService.saveFile(
        file,
        data.folder || 'avatar',
      );
      if (newResponseUploadFile) {
        await this.uploadService.deleteFile(data.key);
        this.logger.debug('deleted old image', 'ResizeImage');
      }
      this.logger.warn('finish resize image', 'ResizeImage');
      return newResponseUploadFile;
    } catch (e) {
      this.logger.error(`error while resize image ${JSON.stringify(e)}`, 'ResizeImage');
    }
  }

  async streamToBuffer(stream: NodeJS.ReadableStream) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }
}
