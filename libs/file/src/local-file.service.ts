import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { IFileService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { lookup } from 'mime-types';
import { join } from 'path';

@Injectable()
export class LocalFileService implements IFileService {
  constructor(private readonly logger: AppLogger) {}
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
