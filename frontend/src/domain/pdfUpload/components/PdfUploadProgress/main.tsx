/**
 * @component PdfUploadProgress
 * @domain pdfUpload
 *
 * Displays PDF upload progress with animated progress bar, percentage,
 * and cancel button.
 */

import { Loader2, X } from 'lucide-react';
import { Progress } from '@/core/components/progress';
import { Card, CardContent } from '@/core/components/card';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import type { PdfUploadProgressProps } from './types';

function PdfUploadProgress({ progress, fileName, onCancel, className }: PdfUploadProgressProps) {
  return (
    <Card className={cn('shadow-lg', className)}>
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="text-primary size-5 animate-spin" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium" title={fileName}>
              {fileName}
            </p>
            <p className="text-muted-foreground text-sm">Fazendo upload...</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm font-semibold">{progress.percentage}%</span>
            {onCancel && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onCancel}
                aria-label="Cancelar upload"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        </div>

        <Progress value={progress.percentage} className="h-2" />

        <div className="text-muted-foreground flex justify-between text-xs">
          <span>{formatBytes(progress.loaded)}</span>
          <span>{formatBytes(progress.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export { PdfUploadProgress };
