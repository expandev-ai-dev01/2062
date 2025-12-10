/**
 * @summary
 * Centralized service instances exports.
 * Provides single import point for all service configurations and instances.
 *
 * @module instances
 */

/**
 * InitExample instances
 */
export { initExampleStore, type InitExampleRecord } from './initExample';

/**
 * FileUpload instances
 */
export { fileUploadStore, type FileUploadRecord } from './fileUpload';

/**
 * PDFUpload instances
 */
export { pdfUploadStore, type PDFUploadRecord } from './pdfUpload';
