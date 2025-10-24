export interface IFileService {
  getFile(key: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
}
