/**
 * @service fileUploadService
 * @domain fileUpload
 * @type REST
 *
 * Service for handling PNG file uploads with validation and preview generation.
 * Integrates with backend /api/internal/file-upload endpoints.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { UploadedFile } from '../types/models';

export const fileUploadService = {
  /**
   * Upload a PNG file to the server
   * @param file - PNG file to upload
   * @param onProgress - Optional callback for upload progress
   * @returns Promise with uploaded file information
   */
  async upload(
    file: File,
    onProgress?: (progress: { loaded: number; total: number; percentage: number }) => void
  ): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await authenticatedClient.post<{ success: boolean; data: UploadedFile }>(
      '/file-upload',
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
   * Get uploaded file information by ID
   * @param id - File identifier
   * @returns Promise with file information
   */
  async getById(id: string): Promise<UploadedFile> {
    const { data } = await authenticatedClient.get<{ success: boolean; data: UploadedFile }>(
      `/file-upload/${id}`
    );
    return data.data;
  },

  /**
   * Cancel/delete an uploaded file
   * @param id - File identifier
   * @returns Promise with confirmation message
   */
  async cancel(id: string): Promise<{ message: string }> {
    const { data } = await authenticatedClient.delete<{
      success: boolean;
      data: { message: string };
    }>(`/file-upload/${id}`);
    return data.data;
  },
};
