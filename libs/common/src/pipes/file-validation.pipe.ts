import { Injectable, PipeTransform } from '@nestjs/common';
import { ApiError } from '../errors/api-error';
import { type IFileValidationOptions } from '@app/shared';
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: IFileValidationOptions) {}
  transform(file: Express.Multer.File) {
    if (!file) throw ApiError.BadRequest('NOT_FOUND', { prop: 'file' });
    if (file.size > this.options.maxSize)
      throw ApiError.BadRequest('FILE_TO_LARGE', { max: this.options.maxSize / 1024 / 1024 });

    if (!this.options.allowedTypes.includes(file.mimetype))
      throw ApiError.BadRequest('FILE_NOT_ALLOWED', { type: file.mimetype });

    return file;
  }
}
