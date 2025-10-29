import { ApiError } from '@app/common/errors';
import { Injectable } from '@nestjs/common';

import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
    this.bucket = config.r2Config.bucketName!;
    this.endpoint = config.r2Config.endpoint!;

    this.r2 = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.config.r2Config.accessKeyId!,
        secretAccessKey: this.config.r2Config.secretAccessKey!,
      },
      forcePathStyle: false,
    });
  }
  async deleteFile(key: string): Promise<boolean> {
    try {
      this.logger.debug('🔧 Deleting file ...', R2FileService.name);
      await this.r2.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch (error) {
      this.logger.error(error, undefined, R2FileService.name);
      return false;
    }
  }

  async getFile(key: string) {
    try {
      this.logger.debug('🔧 Getting file...', R2FileService.name);
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      const res = await this.r2.send(command);
      const stream = res.Body as NodeJS.ReadableStream;
      const contentType = res.ContentType || 'application/octet-stream';

      return { stream, contentType };
    } catch (error) {
      this.logger.error(error, R2FileService.name);
      throw ApiError.NotFound('NOT_FOUND', { prop: 'File' });
    }
  }
}
