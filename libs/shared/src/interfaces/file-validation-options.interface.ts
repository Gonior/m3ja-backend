export interface IFileValidationOptions {
  maxSize: number;
  allowedTypes: string[];
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
