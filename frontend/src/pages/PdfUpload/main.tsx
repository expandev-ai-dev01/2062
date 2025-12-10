/**
 * @page PdfUploadPage
 * Page for PDF file upload functionality with integrity validation and virus scanning.
 * Integrates PdfUploadZone, PdfUploadProgress, and PdfPreview components.
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { usePdfUpload } from '@/domain/pdfUpload/hooks/usePdfUpload';
import { PdfUploadZone } from '@/domain/pdfUpload/components/PdfUploadZone';
import { PdfPreview } from '@/domain/pdfUpload/components/PdfPreview';
import { PdfUploadProgress } from '@/domain/pdfUpload/components/PdfUploadProgress';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { Button } from '@/core/components/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

function PdfUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    upload,
    cancel,
    uploadedFile,
    progress,
    isUploading,
    isUploadInProgress,
    reset: resetUpload,
  } = usePdfUpload({
    onSuccess: () => {
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

    if (isUploadInProgress) {
      toast.error(
        'Já existe um upload em andamento. Por favor, aguarde a conclusão antes de enviar outro arquivo.'
      );
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('O arquivo excede o limite de 50MB. Por favor, selecione um arquivo menor');
      return;
    }

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error(
        'O arquivo selecionado não é um PDF. Por favor, selecione um arquivo com extensão .pdf'
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
        await cancel(uploadedFile.id);
      } catch (err) {
        console.error('Cancel error:', err);
      }
    }
    resetUpload();
    setSelectedFile(null);
  };

  const handleReplace = () => {
    resetUpload();
    setSelectedFile(null);
  };

  const handleCancelUpload = async () => {
    if (uploadedFile?.id) {
      try {
        await cancel(uploadedFile.id);
      } catch (err) {
        console.error('Cancel error:', err);
      }
    }
    resetUpload();
    setSelectedFile(null);
  };

  const handleProceedToConversion = () => {
    toast.info('Funcionalidade de conversão será implementada em breve');
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-200px)] max-w-4xl flex-col items-center justify-center gap-8 py-12">
      <div className="w-full space-y-4 text-center">
        <h1 className="text-primary text-4xl font-bold tracking-tight">Upload de Arquivo PDF</h1>
        <p className="text-muted-foreground text-lg">
          Faça upload de arquivos PDF com validação de integridade e verificação de segurança
        </p>
      </div>

      <div className="w-full space-y-6">
        {!isUploading && !uploadedFile && (
          <PdfUploadZone
            onFileSelect={handleFileSelect}
            disabled={isUploading || isUploadInProgress}
          />
        )}

        {isUploading && selectedFile && progress && (
          <PdfUploadProgress
            progress={progress}
            fileName={selectedFile.name}
            onCancel={handleCancelUpload}
          />
        )}

        {uploadedFile && !isUploading && (
          <div className="space-y-4">
            {uploadedFile.integrityValid && uploadedFile.scanResult === 'limpo' && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <AlertCircle className="text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-200">
                  Upload concluído com sucesso!
                </AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Seu arquivo foi verificado e está pronto para ser processado.
                </AlertDescription>
              </Alert>
            )}

            <PdfPreview file={uploadedFile} onRemove={handleRemove} onReplace={handleReplace} />

            {uploadedFile.integrityValid && (
              <Button onClick={handleProceedToConversion} className="w-full" size="lg">
                Prosseguir para Conversão
                <ArrowRight />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="text-muted-foreground w-full space-y-2 text-center text-sm">
        <p>Formatos suportados: PDF</p>
        <p>Tamanho máximo: 50MB por arquivo</p>
        <p>Verificação automática de integridade e malware</p>
      </div>
    </div>
  );
}

export { PdfUploadPage };
