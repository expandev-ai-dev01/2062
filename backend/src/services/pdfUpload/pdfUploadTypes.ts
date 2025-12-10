/**
 * @summary
 * Type definitions for PDF upload entity.
 *
 * @module services/pdfUpload/pdfUploadTypes
 */

/**
 * @interface PDFUploadEntity
 * @description Represents an uploaded PDF file with metadata and validation results
 *
 * @property {string} id - Unique file identifier (UUID v4)
 * @property {string} fileName - Original file name
 * @property {number} fileSize - File size in bytes
 * @property {string} fileSizeFormatted - File size in readable format (KB/MB)
 * @property {string} mimeType - File MIME type
 * @property {Buffer} buffer - File buffer data
 * @property {string} uploadedAt - ISO 8601 timestamp
 * @property {boolean} integrityValid - PDF integrity validation result
 * @property {string|null} corruptionType - Type of corruption if integrity is invalid
 * @property {string} scanResult - Virus scan result (limpo | infectado | não_verificado | erro_scan)
 * @property {string} token - Access token for file (JWT, 24h validity)
 * @property {string} status - Upload status (aguardando | em_progresso | concluido | erro | cancelado | interrompido)
 */
export interface PDFUploadEntity {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  buffer: Buffer;
  uploadedAt: string;
  integrityValid: boolean;
  corruptionType: string | null;
  scanResult: 'limpo' | 'infectado' | 'não_verificado' | 'erro_scan';
  token: string;
  status: 'aguardando' | 'em_progresso' | 'concluido' | 'erro' | 'cancelado' | 'interrompido';
}

/**
 * @interface PDFUploadResponse
 * @description Response structure for PDF upload operations
 *
 * @property {string} id - Unique file identifier
 * @property {string} fileName - Original file name
 * @property {number} fileSize - File size in bytes
 * @property {string} fileSizeFormatted - File size in readable format (KB/MB)
 * @property {string} mimeType - File MIME type
 * @property {string} uploadedAt - ISO 8601 timestamp
 * @property {boolean} integrityValid - PDF integrity validation result
 * @property {string|null} corruptionType - Type of corruption if integrity is invalid
 * @property {string} scanResult - Virus scan result (limpo | infectado | não_verificado | erro_scan)
 * @property {string} token - Access token for file (JWT, 24h validity)
 */
export interface PDFUploadResponse {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  uploadedAt: string;
  integrityValid: boolean;
  corruptionType: string | null;
  scanResult: 'limpo' | 'infectado' | 'não_verificado' | 'erro_scan';
  token: string;
}

/**
 * @interface PDFCorruptionDetails
 * @description Details about PDF corruption
 *
 * @property {string} type - Type of corruption detected
 * @property {string} message - Human-readable description
 */
export interface PDFCorruptionDetails {
  type:
    | 'cabeçalho_inválido'
    | 'xref_corrompida'
    | 'trailer_ausente'
    | 'objeto_corrompido'
    | 'stream_inválida'
    | 'estrutura_inválida'
    | 'outro';
  message: string;
}
