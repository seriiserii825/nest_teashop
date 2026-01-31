export interface FileUpdateResult {
  filesToKeep: string[];
  filesToDelete: string[];
}

export interface IFile {
  url: string;
  name: string;
}

export interface IFileResponse {
  url: string;
  name: string;
}
