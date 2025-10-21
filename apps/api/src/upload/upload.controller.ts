import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { memoryStorage } from 'multer';
import { FileValidationPipe } from '@app/common';
import { ALLOWED_FILE_TYPE, MAX_FILE_SIZE } from '@app/shared';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(), // simpan di RAM -> tulis ke disk
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadFile(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: MAX_FILE_SIZE,
        allowedTypes: [...ALLOWED_FILE_TYPE],
      }),
    )
    file: Express.Multer.File,
    @Body() userId: number,
  ) {
    const result = await this.uploadService.saveFile(file);
    return {
      message: 'File berhasil diupload',
      file: result,
      userId,
    };
  }
}
