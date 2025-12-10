/**
 * @component FilePreview
 * @domain fileUpload
 *
 * Displays preview and information of uploaded PNG file.
 * Shows image thumbnail, file details, and action buttons.
 */

import { X, FileImage, Download } from 'lucide-react';
import { Button } from '@/core/components/button';
import { Card, CardContent } from '@/core/components/card';
import { Separator } from '@/core/components/separator';
import { cn } from '@/core/lib/utils';
import type { FilePreviewProps } from './types';

function FilePreview({ file, onRemove, onReplace, className }: FilePreviewProps) {
  return (
    <Card className={cn('overflow-hidden shadow-lg', className)}>
      <CardContent className="p-0">
        <div className="relative">
          <div className="bg-muted flex aspect-video items-center justify-center overflow-hidden">
            {file.previewUrl ? (
              <img
                src={file.previewUrl}
                alt={file.fileName}
                className="h-full w-full object-contain"
              />
            ) : (
              <FileImage className="text-muted-foreground size-16" />
            )}
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
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium" title={file.fileName}>
                  {file.fileName}
                </p>
                <p className="text-muted-foreground text-sm">{file.fileSizeFormatted}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Dimensões</p>
                <p className="font-medium">{file.dimensions}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Formato</p>
                <p className="font-medium">PNG</p>
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

export { FilePreview };
