import { Injectable, PipeTransform } from '@nestjs/common';
import { ApiError } from '../errors/api-error';
import { type IFileValidationOptions } from '@app/shared';
import sharp from 'sharp';
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: IFileValidationOptions) {}
  async transform(file: Express.Multer.File) {
    // kalau optional = true dan file tidak dikirim
    // console.log(this.options);
    if (!file && this.options.optional) return undefined;
    if (!file) throw ApiError.BadRequest('NOT_FOUND', { prop: 'file' });
    if (file.size > this.options.maxSize)
      throw ApiError.BadRequest('FILE_TOO_LARGE', { max: this.options.maxSize / 1024 / 1024 });

    if (!this.options.allowedTypes.includes(file.mimetype))
      throw ApiError.BadRequest('FILE_NOT_ALLOWED', { type: file.mimetype });
    if (this.options.type === 'avatar') {
      const meta = await sharp(file.buffer)
        .metadata()
        .catch(() => {
          throw ApiError.BadRequest('UNREADABLE_FILE');
        });
      if (!meta.width || !meta.height) throw ApiError.BadRequest('CAN_NOT_READ_DIMENSION');
      const ratio = meta.width / meta.height;
      console.log(ratio);
      // toleransi 5%
      if (ratio > 1.05 || ratio < 0.95) throw ApiError.BadRequest('INVALID_RASIO_AVATAR');
    }
    return file;
  }
}
