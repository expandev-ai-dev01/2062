/**
 * @module domain/fileUpload/validations/fileUpload
 * File upload validation schemas using Zod 4.1.11
 */

import { z } from 'zod';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/png'] as const;

export const fileUploadSchema = z.object({
  file: z
    .instanceof(File, {
      message: 'Nenhum arquivo foi selecionado. Por favor, selecione um arquivo PNG',
    })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      'O arquivo excede o limite de 10MB. Por favor, selecione um arquivo menor'
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]),
      'O arquivo selecionado não é um PNG. Por favor, selecione um arquivo com extensão .png'
    )
    .refine(
      (file) => file.name.toLowerCase().endsWith('.png'),
      'O arquivo selecionado não é um PNG. Por favor, selecione um arquivo com extensão .png'
    ),
});

export type FileUploadInput = z.input<typeof fileUploadSchema>;
export type FileUploadOutput = z.output<typeof fileUploadSchema>;
