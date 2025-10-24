import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import {
  generateFilename,
  IDeletedFileResponse,
  IUploadFileResponse,
  IUploadService,
} from '@app/shared';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { EnvService } from '@app/common/config/env.config.service';
import { promises as fs } from 'fs';
import path, { join } from 'path';

@Injectable()
export class LocalUploadService implements IUploadService {
  constructor(
    private readonly logger: AppLogger,
    private readonly config: EnvService,
  ) {
    this.logger.setContext('LocalUploadService');
  }
  getFile(key: string): Promise<GetObjectCommandOutput> {
    throw new Error('Method not implemented.');
  }
  async deleteFile(key: string): Promise<IDeletedFileResponse> {
    this.logger.debug(`⚠️ start to delete file ${key}`);
    const filePath = path.join(process.cwd(), 'uploads', key);
    await fs.rm(filePath).catch((error) => {
      this.logger.error(error);
      throw ApiError.Internal();
    });
    this.logger.debug('finish to delete file');
    return {
      success: true,
      message: 'File deleted!',
    };
  }
  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    this.logger.debug(`⚠️ start to save file ${file.filename} to ${folder}`);
    const uploadeDir = join(process.cwd(), 'uploads', folder);

    // buat folder '/uploads' kalo semisal tidak ada
    await fs.mkdir(uploadeDir, { recursive: true });

    const filename = generateFilename(file);
    const filePath = join(uploadeDir, filename);

    // simpan file
    await fs.writeFile(filePath, file.buffer).catch((error) => {
      this.logger.error(error);
      throw ApiError.Internal();
    });
    this.logger.debug(`finish to save file ${file.filename} to ${folder}`);

    return {
      originalName: file.originalname,
      savedAs: filename,
      key: `${folder}/${filename}`,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
