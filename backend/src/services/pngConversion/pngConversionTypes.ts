/**
 * @summary
 * Type definitions for PNG conversion operations.
 *
 * @module services/pngConversion/pngConversionTypes
 */

/**
 * @interface PNGMetadata
 * @description PNG image metadata extracted from file
 *
 * @property {number} width - Image width in pixels
 * @property {number} height - Image height in pixels
 * @property {number} bitDepth - Bit depth (1, 2, 4, 8, 16)
 * @property {number} colorType - Color type (0=grayscale, 2=RGB, 3=indexed, 4=grayscale+alpha, 6=RGBA)
 * @property {boolean} hasTransparency - Whether image has transparency
 */
export interface PNGMetadata {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  hasTransparency: boolean;
}

/**
 * @interface PNGConversionResponse
 * @description Response structure for PNG to Base64 conversion
 *
 * @property {string} fileId - Original file identifier
 * @property {string} base64String - Complete base64 string with MIME prefix
 * @property {number} base64Size - Size of base64 string in bytes
 * @property {number} expectedSize - Expected size based on original file
 * @property {boolean} integrityValid - Integrity validation result
 * @property {PNGMetadata} metadata - PNG metadata preserved
 * @property {string} convertedAt - ISO 8601 timestamp of conversion
 */
export interface PNGConversionResponse {
  fileId: string;
  base64String: string;
  base64Size: number;
  expectedSize: number;
  integrityValid: boolean;
  metadata: PNGMetadata;
  convertedAt: string;
}
