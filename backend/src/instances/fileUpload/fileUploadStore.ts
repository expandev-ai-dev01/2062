/**
 * @summary
 * In-memory store instance for FileUpload entity.
 * Provides singleton pattern for temporary file storage.
 *
 * @module instances/fileUpload/fileUploadStore
 */

import { FILE_UPLOAD_LIMITS } from '@/constants/fileUpload';
import { FileUploadEntity } from '@/services/fileUpload/fileUploadTypes';

/**
 * FileUpload record structure (alias for FileUploadEntity)
 */
export type FileUploadRecord = FileUploadEntity;

/**
 * In-memory store for FileUpload records
 */
class FileUploadStore {
  private records: Map<string, FileUploadRecord> = new Map();

  /**
   * Get all records
   */
  getAll(): FileUploadRecord[] {
    return Array.from(this.records.values());
  }

  /**
   * Get record by ID
   */
  getById(id: string): FileUploadRecord | undefined {
    return this.records.get(id);
  }

  /**
   * Add new record
   */
  add(record: FileUploadRecord): FileUploadRecord {
    if (this.records.size >= FILE_UPLOAD_LIMITS.MAX_RECORDS) {
      throw new Error('Maximum file upload limit reached');
    }
    this.records.set(record.id, record);
    return record;
  }

  /**
   * Delete record by ID
   */
  delete(id: string): boolean {
    return this.records.delete(id);
  }

  /**
   * Check if record exists
   */
  exists(id: string): boolean {
    return this.records.has(id);
  }

  /**
   * Get total count of records
   */
  count(): number {
    return this.records.size;
  }

  /**
   * Clear all records (useful for testing)
   */
  clear(): void {
    this.records.clear();
  }
}

/**
 * Singleton instance of FileUploadStore
 */
export const fileUploadStore = new FileUploadStore();
