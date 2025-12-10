/**
 * @hook usePdfUpload
 * @domain pdfUpload
 *
 * Custom hook for managing PDF file uploads with validation, integrity checking,
 * virus scanning, progress tracking, and state management using TanStack Query.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { pdfUploadService } from '../../services/pdfUploadService';
import type { UploadedPdf, PdfUploadProgress } from '../../types/models';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export interface UsePdfUploadOptions {
  onSuccess?: (file: UploadedPdf) => void;
  onError?: (error: Error) => void;
}

export const usePdfUpload = (options?: UsePdfUploadOptions) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<PdfUploadProgress | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedPdf | null>(null);
  const [isUploadInProgress, setIsUploadInProgress] = useState(false);
  const uploadAbortController = useRef<AbortController | null>(null);

  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: async (file: File) => {
      if (isUploadInProgress) {
        throw new Error(
          'Já existe um upload em andamento. Por favor, aguarde a conclusão antes de enviar outro arquivo.'
        );
      }

      setIsUploadInProgress(true);
      uploadAbortController.current = new AbortController();

      try {
        const result = await pdfUploadService.upload(file, (progressData) => {
          setProgress({
            loaded: progressData.loaded,
            total: progressData.total,
            percentage: progressData.percentage,
          });
        });
        return result;
      } finally {
        uploadAbortController.current = null;
      }
    },
    onSuccess: (data) => {
      setUploadedFile(data);
      setProgress(null);
      setIsUploadInProgress(false);
      queryClient.invalidateQueries({ queryKey: ['pdf-upload'] });

      if (data.scanResult === 'erro_scan') {
        toast.warning(
          'Não foi possível verificar o arquivo quanto a malware. Prosseguindo com cautela.',
          {
            description:
              'O serviço de escaneamento está temporariamente indisponível. O arquivo foi aceito mas não foi verificado.',
          }
        );
      } else if (!data.integrityValid) {
        const corruptionMessage = data.corruptionType
          ? `Tipo de corrupção: ${getCorruptionTypeMessage(data.corruptionType)}`
          : 'O arquivo PDF está corrompido ou inválido';
        toast.error('Arquivo PDF inválido', {
          description: corruptionMessage,
        });
      } else {
        toast.success('Arquivo PDF carregado com sucesso!');
      }

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      setProgress(null);
      setIsUploadInProgress(false);
      uploadAbortController.current = null;

      const errorMessage =
        error.message || 'Ocorreu um erro ao fazer upload do arquivo. Por favor, tente novamente.';
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });

  const { mutateAsync: cancel } = useMutation({
    mutationFn: (id: string) => {
      if (uploadAbortController.current) {
        uploadAbortController.current.abort();
      }
      return pdfUploadService.cancel(id);
    },
    onSuccess: () => {
      setUploadedFile(null);
      setProgress(null);
      setIsUploadInProgress(false);
      uploadAbortController.current = null;
      queryClient.invalidateQueries({ queryKey: ['pdf-upload'] });
      toast.success('Upload cancelado com sucesso');
    },
  });

  const reset = () => {
    if (uploadAbortController.current) {
      uploadAbortController.current.abort();
    }
    setUploadedFile(null);
    setProgress(null);
    setIsUploadInProgress(false);
    uploadAbortController.current = null;
  };

  return {
    upload,
    cancel,
    reset,
    uploadedFile,
    progress,
    isUploading: isPending,
    isUploadInProgress,
  };
};

function getCorruptionTypeMessage(corruptionType: string): string {
  const messages: Record<string, string> = {
    cabeçalho_inválido: 'Cabeçalho do PDF inválido',
    xref_corrompida: 'Tabela de referência cruzada corrompida',
    trailer_ausente: 'Trailer do PDF ausente',
    objeto_corrompido: 'Objeto PDF corrompido',
    stream_inválida: 'Stream de dados inválida',
    estrutura_inválida: 'Estrutura do PDF inválida',
    outro: 'Corrupção desconhecida',
  };
  return messages[corruptionType] || corruptionType;
}
