import { UploadConfigs } from '@app/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export interface IFileValidationOptions {
  maxSize: number;
  allowedTypes: string[];
  optional?: boolean;
}

export interface IAvatarConfig extends IFileValidationOptions {
  folder: string;
}

export interface IDococumentConfig extends IFileValidationOptions {
  folder: string;
}
export interface IUploadConfigs {
  avatar: IAvatarConfig;
  document: IDococumentConfig;
}

export interface IUploadTypeOptions {
  type: keyof typeof UploadConfigs;
  dest?: string;
  optional?: boolean;
  custom?: Partial<MulterOptions>;
}
