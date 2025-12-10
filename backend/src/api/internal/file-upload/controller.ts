/**
 * @summary
 * API controller for PNG file upload operations.
 * Handles file upload, validation, and preview generation.
 *
 * @module api/internal/file-upload/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { fileUploadProcess, fileUploadCancel, fileUploadGet } from '@/services/fileUpload';

/**
 * @api {post} /api/internal/file-upload Upload PNG File
 * @apiName UploadPNGFile
 * @apiGroup FileUpload
 *
 * @apiBody {File} file PNG file to upload (max 10MB)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique file identifier
 * @apiSuccess {String} data.fileName Original file name
 * @apiSuccess {Number} data.fileSize File size in bytes
 * @apiSuccess {String} data.fileSizeFormatted File size in readable format (KB/MB)
 * @apiSuccess {Number} data.width Image width in pixels
 * @apiSuccess {Number} data.height Image height in pixels
 * @apiSuccess {String} data.dimensions Formatted dimensions (width x height)
 * @apiSuccess {String} data.previewUrl Base64 data URL for preview
 * @apiSuccess {String} data.mimeType File MIME type
 * @apiSuccess {String} data.uploadedAt ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | FILE_TOO_LARGE | INVALID_FILE_TYPE | CORRUPTED_FILE | UPLOAD_FAILED)
 * @apiError {String} error.message Error message
 */
export async function uploadHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await fileUploadProcess(req);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/file-upload/:id Get Uploaded File Info
 * @apiName GetUploadedFile
 * @apiGroup FileUpload
 *
 * @apiParam {String} id File identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique file identifier
 * @apiSuccess {String} data.fileName Original file name
 * @apiSuccess {Number} data.fileSize File size in bytes
 * @apiSuccess {String} data.fileSizeFormatted File size in readable format (KB/MB)
 * @apiSuccess {Number} data.width Image width in pixels
 * @apiSuccess {Number} data.height Image height in pixels
 * @apiSuccess {String} data.dimensions Formatted dimensions (width x height)
 * @apiSuccess {String} data.previewUrl Base64 data URL for preview
 * @apiSuccess {String} data.mimeType File MIME type
 * @apiSuccess {String} data.uploadedAt ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await fileUploadGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/file-upload/:id Cancel/Delete Uploaded File
 * @apiName CancelUploadedFile
 * @apiGroup FileUpload
 *
 * @apiParam {String} id File identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function cancelHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await fileUploadCancel(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
