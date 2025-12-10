/**
 * @service pngConversionService
 * @domain pngConversion
 * @type REST
 *
 * Service for converting PNG files to Base64 with integrity validation.
 * Integrates with backend /api/internal/png-conversion endpoints.
 */

import { authenticatedClient } from '@/core/lib/api';
import type { ConversionResult } from '../types/models';

export const pngConversionService = {
  /**
   * Convert a PNG file to Base64 string
   * @param fileId - Uploaded file identifier
   * @returns Promise with conversion result including base64 string and metadata
   */
  async convert(fileId: string): Promise<ConversionResult> {
    const { data } = await authenticatedClient.post<{
      success: boolean;
      data: ConversionResult;
    }>('/png-conversion', { fileId });

    return data.data;
  },
};
