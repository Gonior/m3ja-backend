import { AppLogger } from '@app/common';
import { ApiError } from '@app/common/errors';
import { generateFilename, IUploadFileResponse, IUploadService } from '@app/shared';
import { Injectable } from '@nestjs/common';

import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class LocalUploadService implements IUploadService {
  constructor(private readonly logger: AppLogger) {}
  async saveFile(file: Express.Multer.File, folder: string): Promise<IUploadFileResponse> {
    this.logger.debug(`🔧 Uploading file ...`, LocalUploadService.name);
    const uploadeDir = join(process.cwd(), 'uploads', folder);

    // buat folder '/uploads' kalo semisal tidak ada
    await fs.mkdir(uploadeDir, { recursive: true });

    const filename = generateFilename(file);
    const filePath = join(uploadeDir, filename);

    // simpan file
    await fs.writeFile(filePath, file.buffer).catch((error) => {
      this.logger.error(error, LocalUploadService.name);
      throw ApiError.Internal();
    });
    return {
      originalName: file.originalname,
      savedAs: filename,
      folder,
      key: `${folder}/${filename}`,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
