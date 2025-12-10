/**
 * @summary
 * Validation schemas for FileUpload operations.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/fileUpload/fileUploadValidation
 */

import { z } from 'zod';
import { FILE_UPLOAD_LIMITS } from '@/constants';

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
