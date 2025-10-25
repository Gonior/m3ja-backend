import { IDeletedFileResponse, IUploadFileResponse, IUploadService } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { LocalUploadService } from './local-upload.service';
import { R2UploadService } from './r2-upload.service';
import { EnvService } from '@app/common/config/env.config.service';
import { AppLogger } from '@app/common';

@Injectable()
export class UploadService implements IUploadService {
  constructor(
    private readonly localUpload: LocalUploadService,
    private readonly r2UploadService: R2UploadService,
    private readonly logger: AppLogger,
    private envService: EnvService,
  ) {}

  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    if (this.envService.isProduction) {
      this.logger.warn('📁 Set upload file to R2 (cloud)', UploadService.name);
      return await this.r2UploadService.saveFile(file, folder);
    } else {
      this.logger.warn('📁 Set upload file to Local', UploadService.name);
      return await this.localUpload.saveFile(file, folder);
    }
  }

  async deleteFile(key: string): Promise<IDeletedFileResponse> {
    if (this.envService.isProduction) {
      this.logger.warn('📁 Set delete file to R2 (cloud)', UploadService.name);
      return await this.r2UploadService.deleteFile(key);
    } else {
      this.logger.warn('📁 Set delete file to Local', UploadService.name);
      return await this.localUpload.deleteFile(key);
    }
  }
}
