/**
 * @service pdfUploadService
 * @domain pdfUpload
 * @type REST
 *
 * Service for handling PDF file uploads with validation, integrity checking, and virus scanning.
 * Integrates with backend /api/internal/pdf-upload endpoints.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { UploadedPdf } from '../types/models';

export const pdfUploadService = {
  /**
   * Upload a PDF file to the server
   * @param file - PDF file to upload
   * @param onProgress - Optional callback for upload progress
   * @returns Promise with uploaded file information
   */
  async upload(
    file: File,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<UploadedPdf> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await authenticatedClient.post<{ success: boolean; data: UploadedPdf }>(
      '/pdf-upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress({
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage,
            });
          }
        },
      }
    );

    return data.data;
  },

  /**
   * Get uploaded PDF information by ID
   * @param id - File identifier
   * @returns Promise with file information
   */
  async getById(id: string): Promise<UploadedPdf> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: UploadedPdf }>(
      `/pdf-upload/${id}`
    );
    return data.data;
  },

  /**
   * Cancel/delete an uploaded PDF
   * @param id - File identifier
   * @returns Promise with confirmation message
   */
  async cancel(id: string): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<{
      success: boolean;
      data: { message: string };
    }>(`/pdf-upload/${id}`);
    return data.data;
  },
};
