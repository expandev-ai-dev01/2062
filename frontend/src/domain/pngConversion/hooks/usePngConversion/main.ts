/**
 * @hook usePngConversion
 * @domain pngConversion
 *
 * Custom hook for managing PNG to Base64 conversion with validation,
 * integrity checking, and state management using TanStack Query.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pngConversionService } from '../../services/pngConversionService';
import type { ConversionResult } from '../../types/models';
import { toast } from 'sonner';

export interface UsePngConversionOptions {
  onSuccess?: (result: ConversionResult) => void;
  onError?: (error: Error) => void;
}

export const usePngConversion = (options?: UsePngConversionOptions) => {
  const queryClient = useQueryClient();

  const { mutateAsync: convert, isPending } = useMutation({
    mutationFn: (fileId: string) => pngConversionService.convert(fileId),
    onSuccess: (data) => {
      if (!data.integrityValid) {
        toast.warning('Conversão concluída, mas a validação de integridade falhou');
      } else {
        toast.success('Arquivo convertido com sucesso!');
      }
      queryClient.invalidateQueries({ queryKey: ['png-conversion'] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      const errorMessage =
        error.message || 'Ocorreu um erro ao converter o arquivo. Por favor, tente novamente.';
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });

  return {
    convert,
    isConverting: isPending,
  };
};
