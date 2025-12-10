/**
 * @page HomePage
 * Main page for PNG file upload functionality.
 * Integrates FileUploadZone, UploadProgress, and FilePreview components.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { useFileUpload } from '@/domain/fileUpload/hooks/useFileUpload';
import { FileUploadZone } from '@/domain/fileUpload/components/FileUploadZone';
import { FilePreview } from '@/domain/fileUpload/components/FilePreview';
import { UploadProgress } from '@/domain/fileUpload/components/UploadProgress';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { AlertCircle } from 'lucide-react';

function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, uploadedFile, progress, isUploading, reset } = useFileUpload({
    onSuccess: () => {
      toast.success('Arquivo carregado com sucesso!');
      setSelectedFile(null);
    },
  });

  const handleFileSelect = async (file: File | null, error?: string) => {
    if (error) {
      toast.error(error);
      return;
    }

    if (!file) {
      toast.error('Nenhum arquivo foi selecionado');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('O arquivo excede o limite de 10MB. Por favor, selecione um arquivo menor');
      return;
    }

    if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
      toast.error(
        'O arquivo selecionado não é um PNG. Por favor, selecione um arquivo com extensão .png'
      );
      return;
    }

    setSelectedFile(file);

    try {
      await upload(file);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleRemove = async () => {
    if (uploadedFile?.id) {
      try {
        reset();
        toast.success('Arquivo removido com sucesso');
      } catch {
        toast.error('Erro ao remover arquivo');
      }
    } else {
      reset();
      setSelectedFile(null);
    }
  };

  const handleReplace = () => {
    reset();
    setSelectedFile(null);
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-4xl flex-col items-center justify-center gap-8 py-12">
      <div className="w-full space-y-4 text-center">
        <h1 className="text-primary text-4xl font-bold tracking-tight">Conversor de Arquivos</h1>
        <p className="text-muted-foreground text-lg">
          Converta seus arquivos PNG para Base64 de forma rápida e segura
        </p>
      </div>

      <div className="w-full space-y-6">
        {!isUploading && !uploadedFile && (
          <FileUploadZone onFileSelect={handleFileSelect} disabled={isUploading} />
        )}

        {isUploading && selectedFile && progress && (
          <UploadProgress progress={progress} fileName={selectedFile.name} />
        )}

        {uploadedFile && !isUploading && (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <AlertCircle className="text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-800 dark:text-green-200">
                Upload concluído!
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Seu arquivo está pronto para ser convertido em Base64.
              </AlertDescription>
            </Alert>

            <FilePreview file={uploadedFile} onRemove={handleRemove} onReplace={handleReplace} />
          </div>
        )}
      </div>

      <div className="text-muted-foreground w-full space-y-2 text-center text-sm">
        <p>Formatos suportados: PNG</p>
        <p>Tamanho máximo: 10MB por arquivo</p>
      </div>
    </div>
  );
}

export { HomePage };
