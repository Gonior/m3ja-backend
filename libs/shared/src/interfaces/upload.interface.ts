export interface IUploadFileResponse {
  originalName: string;
  savedAs: string;
  key: string; //object key yang dipake di cloudflare R2
  url: string;
  size: number;
  mimeType: string;
}

export interface IUploadService {
  saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse>;
  deleteFile(key: string): Promise<void>;
}
