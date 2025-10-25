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
  async getFile(key: string) {
    if (this.envService.isProduction) {
      this.logger.warn('📁 Get file from R2', R2FileService.name);
      return await this.r2FileService.getFile(key);
    } else {
      this.logger.warn('📁 Get file set Local', R2FileService.name);
      return await this.localFileService.getFile(key);
    }
  }
}
