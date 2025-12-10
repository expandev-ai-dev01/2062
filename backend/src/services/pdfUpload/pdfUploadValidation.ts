/**
 * @summary
 * Validation schemas for PDF upload operations.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/pdfUpload/pdfUploadValidation
 */

import { z } from 'zod';

/**
 * Schema for file ID parameter validation
 */
export const fileIdSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Inferred types from schemas
 */
export type FileIdInput = z.infer<typeof fileIdSchema>;
