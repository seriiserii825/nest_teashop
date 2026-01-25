import {
  Controller,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthJwt } from 'src/auth/decorators/auth.jwt.decorator';
import { FileService } from './file.service';

@AuthJwt()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async saveFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder: string,
  ) {
    return this.fileService.saveFiles(files, folder);
  }
}
