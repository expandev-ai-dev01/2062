/**
 * @hook useFileUpload
 * @domain fileUpload
 *
 * Custom hook for managing PNG file uploads with validation, progress tracking,
 * and state management using TanStack Query.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fileUploadService } from '../../services/fileUploadService';
import type { UploadedFile, FileUploadProgress } from '../../types/models';
import { useState } from 'react';
import { toast } from 'sonner';

export interface UseFileUploadOptions {
  onSuccess?: (file: UploadedFile) => void;
  onError?: (error: Error) => void;
}

export const useFileUpload = (options?: UseFileUploadOptions) => {
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState<FileUploadProgress | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: (file: File) =>
      fileUploadService.upload(file, (progressData) => {
        setProgress({
          loaded: progressData.loaded,
          total: progressData.total,
          percentage: progressData.percentage,
        });
      }),
    onSuccess: (data) => {
      setUploadedFile(data);
      setProgress(null);
      queryClient.invalidateQueries({ queryKey: ['file-upload'] });
      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      setProgress(null);
      const errorMessage =
        error.message || 'Ocorreu um erro ao fazer upload do arquivo. Por favor, tente novamente.';
      toast.error(errorMessage);
      options?.onError?.(error);
    },
  });

  const { mutateAsync: cancel } = useMutation({
    mutationFn: (id: string) => fileUploadService.cancel(id),
    onSuccess: () => {
      setUploadedFile(null);
      setProgress(null);
      queryClient.invalidateQueries({ queryKey: ['file-upload'] });
    },
  });

  const reset = () => {
    setUploadedFile(null);
    setProgress(null);
  };

  return {
    upload,
    cancel,
    reset,
    uploadedFile,
    progress,
    isUploading: isPending,
  };
};
