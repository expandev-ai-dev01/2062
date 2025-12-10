/**
 * @summary
 * Business logic for PNG file upload operations.
 * Handles file validation, processing, preview generation, and storage.
 *
 * @module services/fileUpload/fileUploadService
 */

import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { FILE_UPLOAD_LIMITS } from '@/constants';
import { fileUploadStore } from '@/instances';
import { ServiceError } from '@/utils';
import { FileUploadEntity, FileUploadResponse } from './fileUploadTypes';
import { fileIdSchema } from './fileUploadValidation';

/**
 * PNG file signature (magic bytes)
 */
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Validates PNG file signature
 * @param {Buffer} buffer - File buffer to validate
 * @returns {boolean} True if valid PNG signature
 */
function isPNGFile(buffer: Buffer): boolean {
  if (buffer.length < PNG_SIGNATURE.length) {
    return false;
  }
  return buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
}

/**
 * Extracts PNG image dimensions from buffer
 * @param {Buffer} buffer - PNG file buffer
 * @returns {{ width: number; height: number }} Image dimensions
 */
function extractPNGDimensions(buffer: Buffer): { width: number; height: number } {
  // PNG IHDR chunk starts at byte 16
  // Width: bytes 16-19 (big-endian)
  // Height: bytes 20-23 (big-endian)
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  return { width, height };
}

/**
 * Formats file size in human-readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (KB or MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generates base64 preview URL from buffer
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - File MIME type
 * @returns {string} Base64 data URL
 */
function generatePreviewUrl(buffer: Buffer, mimeType: string): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Processes multipart file upload from Express request
 * @param {Request} req - Express request object
 * @returns {Promise<Buffer>} File buffer
 * @throws {ServiceError} When no file is uploaded or processing fails
 */
async function processMultipartUpload(req: Request): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;

    req.on('data', (chunk: Buffer) => {
      totalSize += chunk.length;
      if (totalSize > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE) {
        reject(
          new ServiceError(
            'FILE_TOO_LARGE',
            `O arquivo excede o limite de ${FILE_UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB. Por favor, selecione um arquivo menor`,
            413
          )
        );
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (chunks.length === 0) {
        reject(
          new ServiceError(
            'VALIDATION_ERROR',
            'Nenhum arquivo foi selecionado. Por favor, selecione um arquivo PNG',
            400
          )
        );
        return;
      }
      resolve(Buffer.concat(chunks));
    });

    req.on('error', (error) => {
      reject(
        new ServiceError(
          'UPLOAD_FAILED',
          'Não foi possível fazer o upload do arquivo devido a problemas de conexão. Por favor, tente novamente',
          500,
          error
        )
      );
    });
  });
}

/**
 * @summary
 * Processes PNG file upload with validation and preview generation.
 *
 * @function fileUploadProcess
 * @module services/fileUpload
 *
 * @param {Request} req - Express request object containing file data
 * @returns {Promise<FileUploadResponse>} Processed file information with preview
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When no file is provided
 * @throws {ServiceError} INVALID_FILE_TYPE (400) - When file is not PNG
 * @throws {ServiceError} FILE_TOO_LARGE (413) - When file exceeds 10MB
 * @throws {ServiceError} CORRUPTED_FILE (400) - When PNG file is corrupted
 * @throws {ServiceError} UPLOAD_FAILED (500) - When upload processing fails
 *
 * @example
 * const result = await fileUploadProcess(req);
 * // Returns: { id: 'uuid', fileName: 'image.png', fileSize: 1024000, ... }
 */
export async function fileUploadProcess(req: Request): Promise<FileUploadResponse> {
  try {
    // Extract file from request
    const buffer = await processMultipartUpload(req);

    // Validate file size
    if (buffer.length > FILE_UPLOAD_LIMITS.MAX_FILE_SIZE) {
      throw new ServiceError(
        'FILE_TOO_LARGE',
        `O arquivo excede o limite de ${FILE_UPLOAD_LIMITS.MAX_FILE_SIZE_MB}MB. Por favor, selecione um arquivo menor`,
        413
      );
    }

    // Validate PNG signature
    if (!isPNGFile(buffer)) {
      throw new ServiceError(
        'INVALID_FILE_TYPE',
        'O arquivo selecionado não é um PNG. Por favor, selecione um arquivo com extensão .png',
        400
      );
    }

    // Extract dimensions
    let dimensions: { width: number; height: number };
    try {
      dimensions = extractPNGDimensions(buffer);
    } catch (error) {
      throw new ServiceError(
        'CORRUPTED_FILE',
        'O arquivo PNG selecionado parece estar corrompido ou não é um PNG válido',
        400
      );
    }

    // Generate file metadata
    const id = uuidv4();
    const fileName = (req.headers['x-file-name'] as string) || 'upload.png';
    const mimeType = 'image/png';
    const now = new Date().toISOString();

    // Create entity
    const entity: FileUploadEntity = {
      id,
      fileName,
      fileSize: buffer.length,
      fileSizeFormatted: formatFileSize(buffer.length),
      width: dimensions.width,
      height: dimensions.height,
      dimensions: `${dimensions.width} x ${dimensions.height}`,
      previewUrl: generatePreviewUrl(buffer, mimeType),
      mimeType,
      buffer,
      uploadedAt: now,
    };

    // Store in memory
    fileUploadStore.add(entity);

    // Return response without buffer
    const { buffer: _, ...response } = entity;
    return response;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }
    throw new ServiceError(
      'UPLOAD_FAILED',
      'Ocorreu um erro no servidor ao processar seu arquivo. Por favor, tente novamente mais tarde',
      500,
      error
    );
  }
}

/**
 * @summary
 * Retrieves uploaded file information by ID.
 *
 * @function fileUploadGet
 * @module services/fileUpload
 *
 * @param {unknown} params - Raw request params containing file ID
 * @returns {Promise<FileUploadResponse>} File information with preview
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When file does not exist
 *
 * @example
 * const file = await fileUploadGet({ id: 'uuid' });
 * // Returns: { id: 'uuid', fileName: 'image.png', ... }
 */
export async function fileUploadGet(params: unknown): Promise<FileUploadResponse> {
  const validation = fileIdSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid file ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const entity = fileUploadStore.getById(id);

  if (!entity) {
    throw new ServiceError('NOT_FOUND', 'File not found', 404);
  }

  // Return response without buffer
  const { buffer: _, ...response } = entity;
  return response;
}

/**
 * @summary
 * Cancels/deletes an uploaded file by ID.
 *
 * @function fileUploadCancel
 * @module services/fileUpload
 *
 * @param {unknown} params - Raw request params containing file ID
 * @returns {Promise<{ message: string }>} Success confirmation
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When file does not exist
 *
 * @example
 * const result = await fileUploadCancel({ id: 'uuid' });
 * // Returns: { message: 'File deleted successfully' }
 */
export async function fileUploadCancel(params: unknown): Promise<{ message: string }> {
  const validation = fileIdSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid file ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!fileUploadStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'File not found', 404);
  }

  fileUploadStore.delete(id);
  return { message: 'File deleted successfully' };
}
