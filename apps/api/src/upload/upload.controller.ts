import { Controller, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { AppLogger, FileValidationPipe, UploadConfigs, UploadType } from '@app/common';
import { UploadService } from '@app/upload';
import { JwtAuthGuard } from '../auth/auth.guard';
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { MAX_AVATAR_SIZE, MAX_FILE_SIZE } from '@app/shared';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly logger: AppLogger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Access Token',
    example: 'Bearer eyaTokenJwtYangPanjangItu',
    required: true,
  })
  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar: PNG, JPG',
        },
      },
    },
  })
  @ApiOperation({
    summary: `Upload avatar dengan kententuan rasio 1:1 dan ukuran maksimal ${MAX_AVATAR_SIZE / 1024 / 1024}MB`,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Access Token',
    example: 'Bearer eyaTokenJwtYangPanjangItu',
    required: true,
  })
  @UploadType({ type: 'avatar' })
  async uploadAvatar(
    @UploadedFile(new FileValidationPipe({ ...UploadConfigs.avatar }))
    file: Express.Multer.File,
  ) {
    if (file) return await this.uploadService.saveFile(file, UploadConfigs.avatar.folder);
  }

  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File dokumen: PDF, DOC, dll.',
        },
      },
    },
  })
  @ApiOperation({
    summary: `Upload file dengan ukuran maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'JWT Access Token',
    example: 'Bearer eyaTokenJwtYangPanjangItu',
    required: true,
  })
  @Post('document')
  @UploadType({ type: 'document' })
  async uploadDocument(
    @UploadedFile(new FileValidationPipe({ ...UploadConfigs.document }))
    file: Express.Multer.File,
  ) {
    if (file) return await this.uploadService.saveFile(file, UploadConfigs.document.folder);
  }
}
