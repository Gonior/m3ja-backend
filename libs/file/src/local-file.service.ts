import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { IFileService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { createReadStream, existsSync, promises as fs } from 'fs';
import { lookup } from 'mime-types';
import path, { join } from 'path';

@Injectable()
export class LocalFileService implements IFileService {
  constructor(private readonly logger: AppLogger) {}
  async deleteFile(key: string): Promise<boolean> {
    this.logger.debug(`🔧 Deleting file ... `, LocalFileService.name);
    const filePath = path.join(process.cwd(), 'uploads', key);
    try {
      await fs.rm(filePath);
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async getFile(key: string) {
    this.logger.debug('🔧 Getting file...', LocalFileService.name);
    const filePath = join(process.cwd(), 'uploads', key);
    if (!existsSync(filePath)) {
      this.logger.error('file not found');
      throw ApiError.NotFound('NOT_FOUND', { prop: 'File' });
    }

    const stream = createReadStream(filePath) as NodeJS.ReadableStream;
    const contentType = lookup(filePath) || 'application/octet-stream';
    this.logger.debug('finish get local file...', LocalFileService.name);
    return { stream, contentType };
  }
}
