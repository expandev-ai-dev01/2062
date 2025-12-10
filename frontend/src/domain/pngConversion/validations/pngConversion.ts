/**
 * @module domain/pngConversion/validations/pngConversion
 * PNG conversion validation schemas using Zod 4.1.11
 */

import { z } from 'zod';

export const pngConversionSchema = z.object({
  fileId: z.string('ID do arquivo é obrigatório').min(1, 'ID do arquivo não pode estar vazio'),
});

export type PngConversionInput = z.input<typeof pngConversionSchema>;
export type PngConversionOutput = z.output<typeof pngConversionSchema>;
