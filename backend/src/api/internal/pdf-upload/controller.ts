/**
 * @summary
 * API controller for PDF file upload operations.
 * Handles file upload, validation, integrity checking, and virus scanning.
 *
 * @module api/internal/pdf-upload/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import { pdfUploadProcess, pdfUploadCancel, pdfUploadGet } from '@/services/pdfUpload';

/**
 * @api {post} /api/internal/pdf-upload Upload PDF File
 * @apiName UploadPDFFile
 * @apiGroup PDFUpload
 *
 * @apiBody {File} file PDF file to upload (max 50MB)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique file identifier
 * @apiSuccess {String} data.fileName Original file name
 * @apiSuccess {Number} data.fileSize File size in bytes
 * @apiSuccess {String} data.fileSizeFormatted File size in readable format (KB/MB)
 * @apiSuccess {String} data.mimeType File MIME type
 * @apiSuccess {String} data.uploadedAt ISO 8601 timestamp
 * @apiSuccess {Boolean} data.integrityValid PDF integrity validation result
 * @apiSuccess {String} data.scanResult Virus scan result (limpo | infectado | não_verificado | erro_scan)
 * @apiSuccess {String} data.token Access token for file (JWT, 24h validity)
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR | FILE_TOO_LARGE | INVALID_FILE_TYPE | CORRUPTED_FILE | MALWARE_DETECTED | UPLOAD_FAILED | UPLOAD_IN_PROGRESS)
 * @apiError {String} error.message Error message
 */
export async function uploadHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await pdfUploadProcess(req);
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
 * @api {get} /api/internal/pdf-upload/:id Get Uploaded PDF Info
 * @apiName GetUploadedPDF
 * @apiGroup PDFUpload
 *
 * @apiParam {String} id File identifier
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.id Unique file identifier
 * @apiSuccess {String} data.fileName Original file name
 * @apiSuccess {Number} data.fileSize File size in bytes
 * @apiSuccess {String} data.fileSizeFormatted File size in readable format (KB/MB)
 * @apiSuccess {String} data.mimeType File MIME type
 * @apiSuccess {String} data.uploadedAt ISO 8601 timestamp
 * @apiSuccess {Boolean} data.integrityValid PDF integrity validation result
 * @apiSuccess {String} data.scanResult Virus scan result (limpo | infectado | não_verificado | erro_scan)
 * @apiSuccess {String|null} data.corruptionType Type of corruption if integrity is invalid
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await pdfUploadGet(req.params);
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
 * @api {delete} /api/internal/pdf-upload/:id Cancel/Delete Uploaded PDF
 * @apiName CancelUploadedPDF
 * @apiGroup PDFUpload
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
    const data = await pdfUploadCancel(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}
