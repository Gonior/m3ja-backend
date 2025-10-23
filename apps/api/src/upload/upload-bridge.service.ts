import { IDeletedFileResponse, IUploadFileResponse, IUploadService } from '@app/shared';
import { GetObjectCommandOutput } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { LocalUploadService } from './local-upload.service';
import { R2UploadService } from './r2-upload.service';
import { EnvService } from '@app/common/config/env.config.service';

@Injectable()
export class UploadBridgeService implements IUploadService {
  constructor(
    private readonly localUpload: LocalUploadService,
    private readonly r2UploadService: R2UploadService,
    private envService: EnvService,
  ) {}

  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    if (this.envService.isProduction) return await this.r2UploadService.saveFile(file, folder);
    else return await this.localUpload.saveFile(file, folder);
  }
  async deleteFile(key: string): Promise<IDeletedFileResponse> {
    if (this.envService.isProduction) return await this.r2UploadService.deleteFile(key);
    else return await this.localUpload.deleteFile(key);
  }
}
