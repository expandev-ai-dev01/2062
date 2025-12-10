/**
 * @component UploadProgress
 * @domain fileUpload
 *
 * Displays upload progress with animated progress bar and percentage.
 */

import { Loader2 } from 'lucide-react';
import { Progress } from '@/core/components/progress';
import { Card, CardContent } from '@/core/components/card';
import { cn } from '@/core/lib/utils';
import type { UploadProgressProps } from './types';

function UploadProgress({ progress, fileName, className }: UploadProgressProps) {
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
          <span className="text-primary text-sm font-semibold">{progress.percentage}%</span>
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

export { UploadProgress };
