export interface IFileService {
  getFile(key: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
  deleteFile(key: string): Promise<boolean>;
}
