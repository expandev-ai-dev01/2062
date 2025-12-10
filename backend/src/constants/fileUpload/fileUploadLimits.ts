/**
 * @summary
 * File upload limits and constraints.
 * Provides centralized configuration for file validation.
 *
 * @module constants/fileUpload/fileUploadLimits
 */

/**
 * @interface FileUploadLimitsType
 * @description Validation constraints for file upload operations.
 *
 * @property {number} MAX_FILE_SIZE - Maximum file size in bytes (10MB)
 * @property {number} MAX_FILE_SIZE_MB - Maximum file size in megabytes (10)
 * @property {string[]} ALLOWED_MIME_TYPES - Allowed MIME types for upload
 * @property {string[]} ALLOWED_EXTENSIONS - Allowed file extensions
 * @property {number} MAX_RECORDS - Maximum number of files in memory storage
 */
export const FILE_UPLOAD_LIMITS = {
  /** Maximum file size in bytes (10MB) */
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  /** Maximum file size in megabytes */
  MAX_FILE_SIZE_MB: 10,
  /** Allowed MIME types */
  ALLOWED_MIME_TYPES: ['image/png'],
  /** Allowed file extensions */
  ALLOWED_EXTENSIONS: ['.png'],
  /** Maximum allowed files in memory */
  MAX_RECORDS: 100,
} as const;

/** Type representing the FILE_UPLOAD_LIMITS constant */
export type FileUploadLimitsType = typeof FILE_UPLOAD_LIMITS;
