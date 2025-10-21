export interface IUploadFileResponse {
  filenmae: string;
  url: string;
  size: number;
  mimiType: string;
}

export interface IUploadService {
  savedFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse>;
}
