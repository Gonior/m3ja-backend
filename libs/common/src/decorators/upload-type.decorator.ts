import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import { IUploadTypeOptions } from '@app/shared';
import { UploadConfigs } from '../config/upload.config';
import 'dotenv-flow/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { ApiError } from '../errors';
export const UploadType = (options: IUploadTypeOptions) => {
  const config = UploadConfigs[options.type];
  const multerOptions: MulterOptions = {
    storage: memoryStorage(),
    limits: { fileSize: config.maxSize },
    fileFilter: (req, file, cb) => {
      const allowed = config.allowedTypes;
      if (!allowed.includes(file.mimetype)) {
        console.log('validation 1');
        return cb(new ApiError('FILE_NOT_ALLOWED', 400, { type: file.mimetype }), false);
      }
      cb(null, true);
    },
    ...options.custom,
  };
  return applyDecorators(UseInterceptors(FileInterceptor('file', multerOptions)));
};
