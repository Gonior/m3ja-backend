import {
  generateFilename,
  IDeletedFileResponse,
  IUploadFileResponse,
  IUploadService,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
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
    this.logger.setContext(R2UploadService.name);
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

  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    try {
      this.logger.debug('start to upload to r2');
      const stream = Readable.from(file.buffer);
      console.log({ stream });
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

      this.logger.debug('finish to upload to r2');
      return {
        originalName: file.originalname,
        savedAs: filename,
        key,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(error);
      throw ApiError.Internal('DATABASE_UPLOAD_ERROR');
    }
  }

  async deleteFile(key: string): Promise<IDeletedFileResponse> {
    try {
      await this.r2.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      this.logger.debug('finish to delete file from r2');
      return {
        success: true,
        message: 'File deleted!',
      };
    } catch (error) {
      this.logger.error(error);
      throw ApiError.Internal('DATABASE_DELETE_ERROR');
    }
  }
}
