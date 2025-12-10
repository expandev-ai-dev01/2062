/**
 * @component PdfPreview
 * @domain pdfUpload
 *
 * Displays preview and information of uploaded PDF file.
 * Shows file details, integrity status, scan result, and action buttons.
 */

import { X, FileText, Download, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Card, CardContent } from '@/core/components/card';
import { Separator } from '@/core/components/separator';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { Badge } from '@/core/components/badge';
import { cn } from '@/core/lib/utils';
import type { PdfPreviewProps } from './types';

function PdfPreview({ file, onRemove, onReplace, className }: PdfPreviewProps) {
  const getScanStatusBadge = () => {
    switch (file.scanResult) {
      case 'limpo':
        return (
          <Badge
            variant="default"
            className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
          >
            <ShieldCheck className="size-3" />
            Verificado
          </Badge>
        );
      case 'infectado':
        return (
          <Badge variant="destructive">
            <ShieldAlert className="size-3" />
            Malware Detectado
          </Badge>
        );
      case 'erro_scan':
        return (
          <Badge
            variant="outline"
            className="border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300"
          >
            <AlertTriangle className="size-3" />
            Não Verificado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertTriangle className="size-3" />
            Não Verificado
          </Badge>
        );
    }
  };

  const getIntegrityBadge = () => {
    if (file.integrityValid) {
      return (
        <Badge
          variant="default"
          className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
        >
          Íntegro
        </Badge>
      );
    }
    return (
      <Badge variant="destructive">
        Corrompido
        {file.corruptionType && `: ${file.corruptionType}`}
      </Badge>
    );
  };

  return (
    <Card className={cn('overflow-hidden shadow-lg', className)}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden">
            <FileText className="text-muted-foreground size-24" />
          </div>

          <Button
            variant="destructive"
            size="icon-sm"
            onClick={onRemove}
            className="absolute right-2 top-2 shadow-lg"
            aria-label="Remover arquivo"
          >
            <X />
          </Button>
        </div>

        <div className="space-y-4 p-6">
          {file.scanResult === 'erro_scan' && (
            <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <AlertTriangle className="text-yellow-600 dark:text-yellow-400" />
              <AlertTitle className="text-yellow-800 dark:text-yellow-200">
                Arquivo não verificado quanto a malware
              </AlertTitle>
              <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                O serviço de escaneamento está temporariamente indisponível. Prossiga com cautela.
              </AlertDescription>
            </Alert>
          )}

          {!file.integrityValid && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <AlertTriangle className="text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-200">
                Arquivo PDF corrompido
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-300">
                {file.corruptionType
                  ? `Tipo de corrupção: ${file.corruptionType}`
                  : 'O arquivo PDF está corrompido ou inválido'}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" title={file.fileName}>
                  {file.fileName}
                </p>
                <p className="text-muted-foreground text-sm">{file.fileSizeFormatted}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {getScanStatusBadge()}
              {getIntegrityBadge()}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Formato</p>
                <p className="font-medium">PDF</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tipo MIME</p>
                <p className="font-medium">{file.mimeType}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Upload realizado em</p>
                <p className="font-medium">
                  {new Date(file.uploadedAt).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onReplace} className="flex-1">
              <Download className="mr-2" />
              Substituir
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export { PdfPreview };
