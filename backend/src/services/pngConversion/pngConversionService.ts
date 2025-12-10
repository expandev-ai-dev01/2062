/**
 * @summary
 * Business logic for PNG to Base64 conversion operations.
 * Handles conversion processing, integrity validation, metadata extraction,
 * and explicit memory cleanup.
 *
 * @module services/pngConversion/pngConversionService
 */

import { fileUploadStore } from '@/instances';
import { ServiceError } from '@/utils';
import { PNGConversionResponse, PNGMetadata } from './pngConversionTypes';
import { conversionRequestSchema } from './pngConversionValidation';

/**
 * PNG chunk type identifiers
 */
const PNG_CHUNKS = {
  IHDR: 'IHDR',
  tRNS: 'tRNS',
  PLTE: 'PLTE',
} as const;

/**
 * PNG color types
 */
const PNG_COLOR_TYPES = {
  GRAYSCALE: 0,
  RGB: 2,
  INDEXED: 3,
  GRAYSCALE_ALPHA: 4,
  RGBA: 6,
} as const;

/**
 * Extracts PNG metadata from buffer
 * @param {Buffer} buffer - PNG file buffer
 * @returns {PNGMetadata} Extracted metadata
 */
function extractPNGMetadata(buffer: Buffer): PNGMetadata {
  try {
    // IHDR chunk starts at byte 16
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    const bitDepth = buffer.readUInt8(24);
    const colorType = buffer.readUInt8(25);

    // Check for transparency
    let hasTransparency = false;
    if (colorType === PNG_COLOR_TYPES.GRAYSCALE_ALPHA || colorType === PNG_COLOR_TYPES.RGBA) {
      hasTransparency = true;
    } else {
      // Check for tRNS chunk
      const bufferStr = buffer.toString('latin1');
      hasTransparency = bufferStr.includes('tRNS');
    }

    return {
      width,
      height,
      bitDepth,
      colorType,
      hasTransparency,
    };
  } catch (error) {
    throw new ServiceError(
      'METADATA_EXTRACTION_FAILED',
      'Não foi possível extrair os metadados da imagem',
      500,
      error
    );
  }
}

/**
 * Calculates expected base64 size
 * @param {number} fileSize - Original file size in bytes
 * @param {string} mimePrefix - MIME type prefix
 * @returns {number} Expected base64 size
 */
function calculateExpectedBase64Size(fileSize: number, mimePrefix: string): number {
  // Base64 encoding increases size by ~33% (4/3 ratio)
  // Formula: Math.ceil(fileSize * 4/3) + prefix length
  return Math.ceil((fileSize * 4) / 3) + mimePrefix.length;
}

/**
 * Validates conversion integrity
 * @param {number} actualSize - Actual base64 string size
 * @param {number} expectedSize - Expected base64 string size
 * @returns {boolean} True if sizes match within tolerance
 */
function validateConversionIntegrity(actualSize: number, expectedSize: number): boolean {
  // Allow 1% tolerance for rounding differences
  const tolerance = expectedSize * 0.01;
  const difference = Math.abs(actualSize - expectedSize);
  return difference <= tolerance;
}

/**
 * Converts PNG buffer to base64 string with MIME prefix
 * @param {Buffer} buffer - PNG file buffer
 * @param {string} mimeType - MIME type
 * @returns {string} Base64 string with MIME prefix
 */
function convertToBase64(buffer: Buffer, mimeType: string): string {
  const base64Data = buffer.toString('base64');
  return `data:${mimeType};base64,${base64Data}`;
}

/**
 * Explicit memory cleanup for temporary objects
 * @param {any[]} references - Array of object references to clean
 */
function cleanupMemory(references: any[]): void {
  try {
    references.forEach((ref) => {
      if (ref && typeof ref === 'object') {
        // Clear object properties
        Object.keys(ref).forEach((key) => {
          delete ref[key];
        });
      }
    });
    // Suggest garbage collection (if available)
    if (global.gc) {
      global.gc();
    }
  } catch (error) {
    // Log cleanup failure but don't throw
    console.warn('Memory cleanup warning:', error);
  }
}

/**
 * @summary
 * Processes PNG to Base64 conversion with integrity validation.
 *
 * @function pngConversionProcess
 * @module services/pngConversion
 *
 * @param {unknown} body - Request body containing fileId
 * @returns {Promise<PNGConversionResponse>} Conversion result with metadata
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When fileId is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When file does not exist
 * @throws {ServiceError} CONVERSION_FAILED (500) - When conversion fails
 * @throws {ServiceError} INTEGRITY_ERROR (500) - When integrity validation fails
 * @throws {ServiceError} MEMORY_ERROR (500) - When memory is insufficient
 *
 * @example
 * const result = await pngConversionProcess({ fileId: 'uuid' });
 * // Returns: { fileId: 'uuid', base64String: 'data:image/png;base64,...', ... }
 */
export async function pngConversionProcess(body: unknown): Promise<PNGConversionResponse> {
  const memoryReferences: any[] = [];

  try {
    /**
     * @validation Validate request body
     * @throws {ServiceError} VALIDATION_ERROR
     */
    const validation = conversionRequestSchema.safeParse(body);

    if (!validation.success) {
      throw new ServiceError(
        'VALIDATION_ERROR',
        'ID do arquivo inválido',
        400,
        validation.error.errors
      );
    }

    const { fileId } = validation.data;

    /**
     * @validation Check file exists
     * @throws {ServiceError} NOT_FOUND
     */
    const fileEntity = fileUploadStore.getById(fileId);

    if (!fileEntity) {
      throw new ServiceError(
        'NOT_FOUND',
        'Arquivo não encontrado. Por favor, faça o upload novamente',
        404
      );
    }

    /**
     * @rule {BR-020} Extract and preserve PNG metadata
     */
    const metadata = extractPNGMetadata(fileEntity.buffer);
    memoryReferences.push(metadata);

    /**
     * @rule {BR-021} Calculate expected base64 size
     */
    const mimePrefix = `data:${fileEntity.mimeType};base64,`;
    const expectedSize = calculateExpectedBase64Size(fileEntity.fileSize, mimePrefix);

    /**
     * @rule {BR-004} Convert to base64 preserving all data
     * @rule {BR-005} Include MIME type prefix
     */
    let base64String: string;
    try {
      base64String = convertToBase64(fileEntity.buffer, fileEntity.mimeType);
      memoryReferences.push(base64String);
    } catch (error) {
      throw new ServiceError(
        'CONVERSION_FAILED',
        'Não foi possível converter o arquivo para base64',
        500,
        error
      );
    }

    /**
     * @rule {BR-006} Validate conversion integrity
     */
    const actualSize = base64String.length;
    const integrityValid = validateConversionIntegrity(actualSize, expectedSize);

    if (!integrityValid) {
      throw new ServiceError(
        'INTEGRITY_ERROR',
        'A conversão não preservou a integridade da imagem',
        500,
        {
          expectedSize,
          actualSize,
          difference: Math.abs(actualSize - expectedSize),
        }
      );
    }

    /**
     * @performance Track conversion completion time
     */
    const convertedAt = new Date().toISOString();

    const response: PNGConversionResponse = {
      fileId,
      base64String,
      base64Size: actualSize,
      expectedSize,
      integrityValid,
      metadata,
      convertedAt,
    };

    return response;
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error;
    }

    // Check for memory errors
    if (error instanceof RangeError || (error as any).code === 'ERR_BUFFER_OUT_OF_BOUNDS') {
      throw new ServiceError(
        'MEMORY_ERROR',
        'Memória insuficiente para processar o arquivo',
        500,
        error
      );
    }

    throw new ServiceError(
      'CONVERSION_FAILED',
      'Ocorreu um erro ao processar a conversão',
      500,
      error
    );
  } finally {
    /**
     * @rule {BR-007} Clean up temporary data
     * @rule {BR-022} Explicit memory cleanup even on error
     */
    cleanupMemory(memoryReferences);
  }
}
