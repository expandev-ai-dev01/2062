/**
 * @module domain/pdfUpload/types/models
 * PDF upload domain type definitions
 */

export interface UploadedPdf {
  id: string;
  fileName: string;
  fileSize: number;
  fileSizeFormatted: string;
  mimeType: string;
  uploadedAt: string;
  integrityValid: boolean;
  scanResult: 'limpo' | 'infectado' | 'não_verificado' | 'erro_scan';
  token: string;
  corruptionType?: string;
}

export interface PdfUploadError {
  code: string;
  message: string;
}

export interface PdfUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface PdfIntegrityStatus {
  valid: boolean;
  corruptionType?: string;
  details?: string;
}

export interface PdfScanResult {
  status: 'limpo' | 'infectado' | 'não_verificado' | 'erro_scan';
  message?: string;
}
