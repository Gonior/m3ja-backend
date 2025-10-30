import { ApiError } from '@app/common/errors';
import { FileService } from '@app/file';
import { ApiResponse } from '@app/shared';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { UploadConfigs } from '@app/common';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @ApiOperation({
    summary: `Get file dengan 'key=folder/filename'; folder: ${Object.values(UploadConfigs).map((c) => c.folder)}`,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Access Token',
    example: 'Bearer eyaTokenJwtYangPanjangItu',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get(':folder/:filename')
  async getFile(@Param('folder') folder: string, @Param('filename') filename: string) {
    if (!folder || !filename)
      throw ApiError.NotFound('NOT_FOUND', { prop: `${folder}/${filename ?? ''}` });

    const { stream, contentType } = await this.fileService.getFile(`${folder}/${filename}`);

    return new StreamableFile(stream as unknown as Uint8Array<ArrayBufferLike>, {
      type: contentType,
      disposition: `inline; filename="${filename}"`,
    });
  }

  @ApiOperation({
    summary: `Delete file dengan 'key=folder/filename'; folder: ${Object.values(UploadConfigs).map((c) => c.folder)}`,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Access Token',
    example: 'Bearer eyaTokenJwtYangPanjangItu',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':folder/:filename')
  async deleteFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
  ): Promise<ApiResponse> {
    let key: string = '';
    let deleted = false;
    if (folder && filename) {
      key = `${folder}/${filename}`;
      deleted = await this.fileService.deleteFile(key);
    }

    return { message: deleted ? 'File delete successfully' : 'Nothing to delete' };
  }
}
