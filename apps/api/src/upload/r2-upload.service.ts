import { generateFilename, IUploadFileResponse, IUploadService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { EnvService } from '@app/common/config/env.config.service';

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

  async getFile(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });

      return await this.r2.send(command);
    } catch (error) {
      this.logger.error(error);
      throw ApiError.Internal();
    }
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    try {
      this.logger.debug('start to upload to r2');
      const filename = generateFilename(file);
      const key = `${folder.replace(/\/$/, '')}/${filename}`;
      this.logger.debug(key);
      await this.r2.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${this.bucket}.${this.config.r2Config.accountId}.r2.cloudflarestorage.com/${key}`;

      this.logger.debug('finish to upload to r2');
      return {
        originalName: file.originalname,
        savedAs: filename,
        key,
        url,
        size: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(error);
      throw ApiError.Internal('DATABASE_UPLOAD_ERROR');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.r2.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      this.logger.debug('finish to delete file from r2');
    } catch (error) {
      this.logger.error(error);
      throw ApiError.Internal('DATABASE_DELETE_ERROR');
    }
  }
}
