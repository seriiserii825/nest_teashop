import { BadRequestException, Injectable } from '@nestjs/common';
import { path as rootPath } from 'app-root-path';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/file/file.service';
import { FileUpdateResult } from './interfaces/file-update-result.interface';

@Injectable()
export class FileManagerService {
  constructor(private readonly fileService: FileService) {}

  /**
   * Загружает один файл
   * @param file - файл для загрузки
   * @param folder - папка назначения (например, 'stores/1')
   * @returns URL загруженного файла или null
   */
  async uploadSingleFile(
    file: Express.Multer.File | undefined,
    folder: string,
  ): Promise<string | null> {
    if (!file) {
      return null;
    }

    try {
      const [uploadedFile] = await this.fileService.saveFiles([file], folder);
      return uploadedFile.url;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`File upload failed: ${errorMessage}`);
    }
  }

  /**
   * Загружает несколько файлов
   * @param files - массив файлов для загрузки
   * @param folder - папка назначения (например, 'products/5')
   * @returns массив URL загруженных файлов
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[] | undefined,
    folder: string,
  ): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    try {
      const uploadedFiles = await this.fileService.saveFiles(files, folder);
      return uploadedFiles.map((file) => file.url);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`File upload failed: ${errorMessage}`);
    }
  }

  /**
   * Обновляет один файл
   * @param currentFile - текущий URL файла
   * @param newFile - новый файл для загрузки
   * @param oldFile - старый файл, который нужно сохранить (если передан)
   * @param folder - папка назначения
   * @returns новый URL файла
   */
  async updateSingleFile(
    currentFile: string | null,
    newFile: Express.Multer.File | undefined,
    oldFile: string | undefined,
    folder: string,
  ): Promise<string | null> {
    // Если передан старый файл для сохранения
    if (oldFile) {
      return oldFile;
    }

    // Если есть новый файл для загрузки
    if (newFile) {
      const newUrl = await this.uploadSingleFile(newFile, folder);

      // Удаляем старый файл после успешной загрузки нового
      if (currentFile && newUrl) {
        await this.deleteSingleFile(currentFile);
      }

      return newUrl;
    }

    // Если нет ни старого, ни нового файла - удаляем текущий
    if (!oldFile && !newFile && currentFile) {
      await this.deleteSingleFile(currentFile);
      return null;
    }

    // Возвращаем текущий файл без изменений
    return currentFile;
  }

  /**
   * Обрабатывает обновление массива файлов
   * @param currentFiles - текущие URL файлов
   * @param filesToKeep - файлы, которые нужно оставить
   * @returns объект с файлами для сохранения и удаления
   */
  processFileUpdates(
    currentFiles: string[],
    filesToKeep?: string[],
  ): FileUpdateResult {
    const keepFiles = filesToKeep || [];
    const deleteFiles = currentFiles.filter(
      (file) => !keepFiles.includes(file),
    );

    return {
      filesToKeep: keepFiles,
      filesToDelete: deleteFiles,
    };
  }

  /**
   * Удаляет один файл с диска
   * @param fileUrl - URL файла для удаления
   */
  async deleteSingleFile(fileUrl: string): Promise<void> {
    try {
      const filePath = join(rootPath, fileUrl);
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${fileUrl}:`, error);
      // Не бросаем ошибку, чтобы не прерывать основной процесс
    }
  }

  /**
   * Удаляет несколько файлов с диска
   * @param fileUrls - массив URL файлов для удаления
   */
  async deleteMultipleFiles(fileUrls: string[]): Promise<void> {
    if (!fileUrls || fileUrls.length === 0) {
      return;
    }

    const deletePromises = fileUrls.map((url) => this.deleteSingleFile(url));
    await Promise.allSettled(deletePromises);
  }

  /**
   * Объединяет старые и новые файлы
   * @param filesToKeep - файлы для сохранения
   * @param newFiles - новые загруженные файлы
   * @param folder - папка назначения
   * @returns объединенный массив URL файлов
   */
  async mergeFiles(
    filesToKeep: string[],
    newFiles: Express.Multer.File[] | undefined,
    folder: string,
  ): Promise<string[]> {
    const uploadedFiles = await this.uploadMultipleFiles(newFiles, folder);
    return [...filesToKeep, ...uploadedFiles];
  }
}
