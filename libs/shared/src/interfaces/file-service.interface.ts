export interface IFileService {
  getFile(
    folder: string,
    filename: string,
  ): Promise<{ stream: NodeJS.ReadableStream; contentType: string }>;
}
