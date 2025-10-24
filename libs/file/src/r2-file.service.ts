import { ApiError } from '@app/common/errors';
import { Injectable } from '@nestjs/common';

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppLogger } from '@app/common';
import { EnvService } from '@app/common/config/env.config.service';
import { IFileService } from '@app/shared';

@Injectable()
export class R2FileService implements IFileService {
  private r2: S3Client;
  private bucket: string;
  private endpoint: string;
  constructor(
    private readonly logger: AppLogger,
    private readonly config: EnvService,
  ) {
    this.logger.setContext(R2FileService.name);
    this.bucket = config.r2Config.bucketName!;
    this.endpoint = config.r2Config.endpoint!;

    this.r2 = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: config.r2Config.accessKeyId!,
        secretAccessKey: config.r2Config.secretAccessKey!,
      },
      forcePathStyle: false,
    });
  }
  async getFile(folder: string, filename: string) {
    try {
      this.logger.debug('start get file from r2');
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: `${folder}/${filename}`,
      });
      const res = await this.r2.send(command);
      const stream = res.Body as NodeJS.ReadableStream;
      const contentType = res.ContentType || 'application/octet-stream';
      return { stream, contentType };
    } catch (error) {
      this.logger.error(error);
      throw ApiError.NotFound('NOT_FOUND', { prop: 'File' });
    }
  }
}
