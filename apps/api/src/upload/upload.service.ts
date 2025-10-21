import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private uploadeDir = join(process.cwd(), 'uploads');

  async saveFile(file: Express.Multer.File) {
    // make folder '/uploads
    await fs.mkdir(this.uploadeDir, { recursive: true });

    // get extention name of file
    const ext = file.originalname.split('.').pop();
    // create a random name of file
    const filename = `${uuid()}.${ext}`;
    const filePath = join(this.uploadeDir, filename);

    // save buffer
    await fs.writeFile(filePath, file.buffer);

    return {
      originalNAme: file.originalname,
      savedAs: filename,
      size: file.size,
      path: filePath,
    };
  }
}
