/**
 * @summary
 * In-memory store instance for PDF upload entity.
 * Provides singleton pattern for temporary file storage with upload tracking.
 *
 * @module instances/pdfUpload/pdfUploadStore
 */

import { PDF_UPLOAD_LIMITS } from '@/constants/pdfUpload';
import { PDFUploadEntity } from '@/services/pdfUpload/pdfUploadTypes';

/**
 * PDF upload record structure (alias for PDFUploadEntity)
 */
export type PDFUploadRecord = PDFUploadEntity;

/**
 * In-memory store for PDF upload records
 */
class PDFUploadStore {
  private records: Map<string, PDFUploadRecord> = new Map();
  private isolatedRecords: Map<string, PDFUploadRecord> = new Map();
  private uploadInProgress: string | null = null;

  /**
   * Check if upload is in progress
   */
  hasUploadInProgress(): boolean {
    return this.uploadInProgress !== null;
  }

  /**
   * Set upload in progress
   */
  setUploadInProgress(uploadId: string): void {
    this.uploadInProgress = uploadId;
  }

  /**
   * Clear upload in progress
   */
  clearUploadInProgress(): void {
    this.uploadInProgress = null;
  }

  /**
   * Get all records
   */
  getAll(): PDFUploadRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: string): PDFUploadRecord | undefined {
    return this.records.get(id) || this.isolatedRecords.get(id);
  }

  /**
   * Add new record
   */
  add(record: PDFUploadRecord): PDFUploadRecord {
    if (this.records.size >= PDF_UPLOAD_LIMITS.MAX_RECORDS) {
      throw new Error('Maximum file upload limit reached');
    }
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Add record to isolated area (for files with scan errors)
   */
  addToIsolated(record: PDFUploadRecord): PDFUploadRecord {
    if (this.isolatedRecords.size >= PDF_UPLOAD_LIMITS.MAX_RECORDS) {
      throw new Error('Maximum isolated file limit reached');
    }
    this.isolatedRecords.set(record.id, record);
    return record;
  }

  /**
   * Delete record by ID
   */
  delete(id: string): boolean {
    return this.records.delete(id) || this.isolatedRecords.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: string): boolean {
    return this.records.has(id) || this.isolatedRecords.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size + this.isolatedRecords.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
    this.isolatedRecords.clear();
    this.uploadInProgress = null;
  }
}

/**
 * Singleton instance of PDFUploadStore
 */
export const pdfUploadStore = new PDFUploadStore();
