/**
 * @summary
 * Type definitions for FileUpload entity.
 *
 * @module services/fileUpload/fileUploadTypes
 */

/**
 * @interface FileUploadEntity
 * @description Represents an uploaded PNG file with metadata
 */
export interface FileUploadEntity {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  width: number;
  height: number;
  dimensions: string;
  previewUrl: string;
  mimeType: string;
  buffer: Buffer;
  uploadedAt: string;
}

/**
 * @interface FileUploadResponse
 * @description Response structure for file upload operations
 */
export interface FileUploadResponse {
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
