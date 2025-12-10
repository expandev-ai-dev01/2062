/**
 * @page HomePage
 * Main page for PNG file upload and Base64 conversion functionality.
 * Integrates FileUploadZone, UploadProgress, FilePreview, and ConversionResult components.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { useFileUpload } from '@/domain/fileUpload/hooks/useFileUpload';
import { usePngConversion } from '@/domain/pngConversion/hooks/usePngConversion';
import { FileUploadZone } from '@/domain/fileUpload/components/FileUploadZone';
import { FilePreview } from '@/domain/fileUpload/components/FilePreview';
import { UploadProgress } from '@/domain/fileUpload/components/UploadProgress';
import { ConversionResult } from '@/domain/pngConversion/components/ConversionResult';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { Button } from '@/core/components/button';
import { AlertCircle, ArrowRight } from 'lucide-react';
import type { ConversionResult as ConversionResultType } from '@/domain/pngConversion/types';

function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResultType | null>(null);

  const {
    upload,
    uploadedFile,
    progress,
    isUploading,
    reset: resetUpload,
  } = useFileUpload({
    onSuccess: () => {
      toast.success('Arquivo carregado com sucesso!');
      setSelectedFile(null);
    },
  });

  const { convert, isConverting } = usePngConversion({
    onSuccess: (result) => {
      setConversionResult(result);
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
    setConversionResult(null);

    try {
      await upload(file);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleConvert = async () => {
    if (!uploadedFile?.id) {
      toast.error('Nenhum arquivo carregado para converter');
      return;
    }

    try {
      await convert(uploadedFile.id);
    } catch (err) {
      console.error('Conversion error:', err);
    }
  };

  const handleRemove = () => {
    resetUpload();
    setSelectedFile(null);
    setConversionResult(null);
    toast.success('Arquivo removido com sucesso');
  };

  const handleReplace = () => {
    resetUpload();
    setSelectedFile(null);
    setConversionResult(null);
  };

  const handleCopyBase64 = () => {
    if (conversionResult?.base64String) {
      navigator.clipboard
        .writeText(conversionResult.base64String)
        .then(() => {
          toast.success('String Base64 copiada para a área de transferência!');
        })
        .catch(() => {
          toast.error('Erro ao copiar para a área de transferência');
        });
    }
  };

  const handleDownloadBase64 = () => {
    if (conversionResult?.base64String) {
      const blob = new Blob([conversionResult.base64String], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${conversionResult.fileId}_base64.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Arquivo Base64 baixado com sucesso!');
    }
  };

  const handleNewConversion = () => {
    resetUpload();
    setSelectedFile(null);
    setConversionResult(null);
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
        {!isUploading && !uploadedFile && !conversionResult && (
          <FileUploadZone onFileSelect={handleFileSelect} disabled={isUploading} />
        )}

        {isUploading && selectedFile && progress && (
          <UploadProgress progress={progress} fileName={selectedFile.name} />
        )}

        {uploadedFile && !isUploading && !conversionResult && (
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

            <Button onClick={handleConvert} disabled={isConverting} className="w-full" size="lg">
              {isConverting ? (
                'Convertendo...'
              ) : (
                <>
                  Converter para Base64
                  <ArrowRight />
                </>
              )}
            </Button>
          </div>
        )}

        {conversionResult && (
          <div className="space-y-4">
            <ConversionResult
              result={conversionResult}
              onCopy={handleCopyBase64}
              onDownload={handleDownloadBase64}
            />

            <Button onClick={handleNewConversion} variant="outline" className="w-full" size="lg">
              Converter Novo Arquivo
            </Button>
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
