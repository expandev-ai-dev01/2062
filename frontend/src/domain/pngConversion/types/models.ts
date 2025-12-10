/**
 * @module domain/pngConversion/types/models
 * PNG conversion domain type definitions
 */

export interface ConversionResult {
  fileId: string;
  base64String: string;
  base64Size: number;
  expectedSize: number;
  integrityValid: boolean;
  metadata: ConversionMetadata;
  convertedAt: string;
}

export interface ConversionMetadata {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  hasTransparency: boolean;
}

export interface ConversionError {
  code: string;
  message: string;
}
