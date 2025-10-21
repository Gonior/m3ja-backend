import { Injectable, PipeTransform } from '@nestjs/common';
import { ApiError } from '../errors/api-error';
import {
  type IFileValidationOptions,
  isEmptyErrorMessage,
  toLargeErrorMessage,
  typeFileNotAllowed,
} from '@app/shared';
@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly options: IFileValidationOptions) {}
  transform(file: Express.Multer.File) {
    if (!file) throw ApiError.BadRequest(isEmptyErrorMessage({ field: 'file' }, true));
    if (file.size > this.options.maxSize)
      throw ApiError.BadRequest(
        toLargeErrorMessage({ maxSize: this.options.maxSize / 1024 / 1024 }),
      );

    if (!this.options.allowedTypes.includes(file.mimetype))
      throw ApiError.BadRequest(typeFileNotAllowed({ type: file.mimetype }, true));

    return file;
  }
}
