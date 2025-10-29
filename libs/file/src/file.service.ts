import { Injectable } from '@nestjs/common';
import { EnvService } from '@app/common/config/env.config.service';
import { IFileService } from '@app/shared';
import { LocalFileService } from './local-file.service';
import { AppLogger } from '@app/common';
import { R2FileService } from './r2-file.service';

@Injectable()
export class FileService implements IFileService {
  constructor(
    private readonly envService: EnvService,
    private readonly logger: AppLogger,
    private readonly localFileService: LocalFileService,
    private readonly r2FileService: R2FileService,
  ) {}

  async deleteFile(key: string): Promise<boolean> {
    if (this.envService.isProduction) {
      this.logger.warn('📁 Set delete file to R2 (cloud)', FileService.name);
      return await this.r2FileService.deleteFile(key);
    } else {
      this.logger.warn('📁 Set delete file to Local', FileService.name);
      return await this.localFileService.deleteFile(key);
    }
  }
  async getFile(key: string) {
    if (this.envService.isProduction) {
      this.logger.warn('📁 Get file from R2', FileService.name);
      return await this.r2FileService.getFile(key);
    } else {
      this.logger.warn('📁 Get file set Local', FileService.name);
      return await this.localFileService.getFile(key);
    }
  }
}
