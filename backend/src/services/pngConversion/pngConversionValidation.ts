/**
 * @summary
 * Validation schemas for PNG conversion operations.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/pngConversion/pngConversionValidation
 */

import { z } from 'zod';

/**
 * Schema for conversion request validation
 */
export const conversionRequestSchema = z.object({
  fileId: z.string().uuid(),
});

/**
 * Inferred types from schemas
 */
export type ConversionRequestInput = z.infer<typeof conversionRequestSchema>;
