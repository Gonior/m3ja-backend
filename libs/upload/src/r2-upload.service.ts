import { generateFilename, IUploadFileResponse, IUploadService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { EnvService } from '@app/common/config/env.config.service';
import { Readable } from 'stream';

@Injectable()
export class R2UploadService implements IUploadService {
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

  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    try {
      this.logger.debug('🔧 Uploading file ...', R2UploadService.name);
      const stream = Readable.from(file.buffer);
      const filename = generateFilename(file);
      const key = `${folder.replace(/\/$/, '')}/${filename}`;

      await this.r2.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: stream,
          ContentType: file.mimetype,
          ContentLength: file.size,
        }),
      );

      return {
        originalName: file.originalname,
        savedAs: filename,
        folder,
        key,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(error, R2UploadService.name);
      throw ApiError.Internal('DB_UPLOAD_ERROR');
    }
  }
}
