/**
 * @summary
 * PDF upload limits and constraints.
 * Provides centralized configuration for file validation.
 *
 * @module constants/pdfUpload/pdfUploadLimits
 */

/**
 * @interface PDFUploadLimitsType
 * @description Validation constraints for PDF upload operations.
 *
 * @property {number} MAX_FILE_SIZE - Maximum file size in bytes (50MB)
 * @property {number} MAX_FILE_SIZE_MB - Maximum file size in megabytes (50)
 * @property {string[]} ALLOWED_MIME_TYPES - Allowed MIME types for upload
 * @property {string[]} ALLOWED_EXTENSIONS - Allowed file extensions
 * @property {number} MAX_RECORDS - Maximum number of files in memory storage
 * @property {number} TOKEN_VALIDITY_HOURS - Token validity in hours (24)
 */
export const PDF_UPLOAD_LIMITS = {
  /** Maximum file size in bytes (50MB) */
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  /** Maximum file size in megabytes */
  MAX_FILE_SIZE_MB: 50,
  /** Allowed MIME types */
  ALLOWED_MIME_TYPES: ['application/pdf'],
  /** Allowed file extensions */
  ALLOWED_EXTENSIONS: ['.pdf'],
  /** Maximum allowed files in memory */
  MAX_RECORDS: 100,
  /** Token validity in hours */
  TOKEN_VALIDITY_HOURS: 24,
} as const;

/** Type representing the PDF_UPLOAD_LIMITS constant */
export type PDFUploadLimitsType = typeof PDF_UPLOAD_LIMITS;
