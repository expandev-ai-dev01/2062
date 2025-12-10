/**
 * @component ConversionResult
 * @domain pngConversion
 *
 * Displays the Base64 conversion result with metadata, integrity status,
 * and action buttons for copying and downloading.
 */

import { CheckCircle2, AlertCircle, Copy, Download, Image } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/card';
import { Separator } from '@/core/components/separator';
import { Alert, AlertDescription, AlertTitle } from '@/core/components/alert';
import { Textarea } from '@/core/components/textarea';
import { cn } from '@/core/lib/utils';
import type { ConversionResultProps } from './types';

function ConversionResult({ result, onDownload, onCopy, className }: ConversionResultProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={cn('shadow-lg', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="size-5" />
          Resultado da Conversão
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {result.integrityValid ? (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CheckCircle2 className="text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200">
              Conversão bem-sucedida!
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              O arquivo foi convertido para Base64 com integridade validada.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-200">
              Atenção: Validação de integridade
            </AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              A conversão foi concluída, mas a validação de integridade apresentou inconsistências.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-muted-foreground mb-2 block text-sm font-medium">
              String Base64
            </label>
            <Textarea value={result.base64String} readOnly className="font-mono text-xs" rows={6} />
          </div>

          <div className="flex gap-2">
            <Button onClick={onCopy} variant="outline" className="flex-1">
              <Copy />
              Copiar Base64
            </Button>
            <Button onClick={onDownload} variant="default" className="flex-1">
              <Download />
              Baixar como TXT
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold">Informações da Conversão</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tamanho Base64</p>
              <p className="font-medium">{formatBytes(result.base64Size)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tamanho Esperado</p>
              <p className="font-medium">{formatBytes(result.expectedSize)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Dimensões</p>
              <p className="font-medium">
                {result.metadata.width} × {result.metadata.height}px
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Profundidade de Cor</p>
              <p className="font-medium">{result.metadata.bitDepth} bits</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tipo de Cor</p>
              <p className="font-medium">{getColorTypeName(result.metadata.colorType)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Transparência</p>
              <p className="font-medium">{result.metadata.hasTransparency ? 'Sim' : 'Não'}</p>
            </div>
          </div>

          <Separator />

          <div className="text-muted-foreground text-xs">
            <p>Convertido em: {formatDate(result.convertedAt)}</p>
            <p>ID do arquivo: {result.fileId}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getColorTypeName(colorType: number): string {
  const types: Record<number, string> = {
    0: 'Escala de Cinza',
    2: 'RGB',
    3: 'Paleta',
    4: 'Escala de Cinza + Alpha',
    6: 'RGB + Alpha',
  };
  return types[colorType] || `Tipo ${colorType}`;
}

export { ConversionResult };
