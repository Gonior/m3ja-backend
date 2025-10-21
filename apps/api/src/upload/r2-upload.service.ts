import { generateFilename, IUploadFileResponse, IUploadService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ApiError, AppLogger } from '@app/common';

@Injectable()
export class R2UploadService implements IUploadService {
  private r2: S3Client;
  private bucket: string;
  private endpoint: string;
  constructor(
    private readonly logger: AppLogger,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(R2UploadService.name);
    this.bucket = config.get('r2.bucketName')!;
    this.endpoint = config.get('r2.endpoint')!;

    this.r2 = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: config.get('r2.accessKeyId')!,
        secretAccessKey: config.get('r2.secretAccessKey')!,
      },
      forcePathStyle: false,
    });
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

      const url = `https://${this.bucket}.${this.config.get('r2.accountId')}.r2.cloudflarestorage.com/${key}`;

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
      throw ApiError.Internal('Failed to upload to r2');
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
      throw ApiError.Internal('R2 delete Failed');
    }
  }
}
