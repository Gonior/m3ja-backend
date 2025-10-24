import { ApiError } from '@app/common/errors';
import { FileService } from '@app/file';
import { Controller, Get, Param, StreamableFile } from '@nestjs/common';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':folder/:filename')
  async getFile(@Param('folder') folder: string, @Param('filename') filename: string) {
    if (!folder || !filename)
      throw ApiError.NotFound('NOT_FOUND', { prop: `${folder}/${filename ?? ''}` });

    const { stream, contentType } = await this.fileService.getFile(folder, filename);

    return new StreamableFile(stream as unknown as Uint8Array<ArrayBufferLike>, {
      type: contentType,
      disposition: `inline; filename="${filename}"`,
    });
  }
}
