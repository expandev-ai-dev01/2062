/**
 * @module domain/fileUpload/types/models
 * File upload domain type definitions
 */

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  width: number;
  height: number;
  dimensions: string;
  previewUrl: string;
  mimeType: string;
  uploadedAt: string;
}

export interface FileUploadError {
  code: string;
  message: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
