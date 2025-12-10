/**
 * @summary
 * API controller for PNG to Base64 conversion operations.
 * Handles conversion processing with integrity validation and memory management.
 *
 * @module api/internal/png-conversion/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { pngConversionProcess } from '@/services/pngConversion';

/**
 * @api {post} /api/internal/png-conversion Convert PNG to Base64
 * @apiName ConvertPNGToBase64
 * @apiGroup PNGConversion
 *
 * @apiBody {String} fileId File identifier from upload
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.fileId Original file identifier
 * @apiSuccess {String} data.base64String Complete base64 string with MIME prefix
 * @apiSuccess {Number} data.base64Size Size of base64 string in bytes
 * @apiSuccess {Number} data.expectedSize Expected size based on original file
 * @apiSuccess {Boolean} data.integrityValid Integrity validation result
 * @apiSuccess {Object} data.metadata PNG metadata preserved
 * @apiSuccess {Number} data.metadata.width Image width in pixels
 * @apiSuccess {Number} data.metadata.height Image height in pixels
 * @apiSuccess {Number} data.metadata.bitDepth Bit depth
 * @apiSuccess {Number} data.metadata.colorType Color type
 * @apiSuccess {Boolean} data.metadata.hasTransparency Transparency flag
 * @apiSuccess {String} data.convertedAt ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | NOT_FOUND | CONVERSION_FAILED | INTEGRITY_ERROR | MEMORY_ERROR)
 * @apiError {String} error.message Error message
 */
export async function convertHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await pngConversionProcess(req.body);
    res.status(200).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
