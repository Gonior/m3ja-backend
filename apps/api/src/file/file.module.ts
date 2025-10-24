import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileModule as FileModuleCore } from '@app/file';
@Module({
  imports: [FileModuleCore],
  controllers: [FileController],
})
export class FileModule {}
