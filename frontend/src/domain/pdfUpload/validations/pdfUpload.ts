/**
 * @module domain/pdfUpload/validations/pdfUpload
 * PDF upload validation schemas using Zod 4.1.11
 */

import { z } from 'zod';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = ['application/pdf'] as const;

export const pdfUploadSchema = z.object({
  file: z
    .instanceof(File, {
      message: 'Nenhum arquivo foi selecionado. Por favor, selecione um arquivo PDF',
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'O arquivo excede o limite de 50MB. Por favor, selecione um arquivo menor'
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type as (typeof ACCEPTED_FILE_TYPES)[number]),
      'O arquivo selecionado não é um PDF. Por favor, selecione um arquivo com extensão .pdf'
    )
    .refine(
      (file) => file.name.toLowerCase().endsWith('.pdf'),
      'O arquivo selecionado não é um PDF. Por favor, selecione um arquivo com extensão .pdf'
    ),
});

export type PdfUploadInput = z.input<typeof pdfUploadSchema>;
export type PdfUploadOutput = z.output<typeof pdfUploadSchema>;
