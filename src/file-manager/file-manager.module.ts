import { Module } from '@nestjs/common';
import { FileService } from 'src/file/file.service';
import { FileManagerService } from './file-manager.service';

@Module({
  providers: [FileManagerService, FileService],
  exports: [FileManagerService],
})
export class FileManagerModule {}
