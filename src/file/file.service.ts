import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import IFileResponse from './interfaces/IFile';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<IFileResponse[]> {
    const uploadedFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadedFolder);

    const response: IFileResponse[] = await Promise.all(
      files.map(async (file) => {
        if (!file.buffer) {
          throw new Error(
            `File buffer is empty for ${file.originalname}. Make sure to use memoryStorage() in FileInterceptor.`,
          );
        }
        const originalName = `${Date.now()}-${file.originalname}`;
        await writeFile(`${uploadedFolder}/${originalName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${originalName}`,
          name: originalName,
        };
      }),
    );
    return response;
  }
}
