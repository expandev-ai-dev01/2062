/**
 * @component FileUploadZone
 * @domain fileUpload
 *
 * Drag-and-drop file upload zone with click-to-upload functionality.
 * Handles PNG file validation and provides visual feedback.
 */

import { useCallback, useState } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import type { FileUploadZoneProps } from './types';

function FileUploadZone({ onFileSelect, disabled = false, className }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);

      if (files.length > 1) {
        onFileSelect(null, 'Por favor, arraste apenas um arquivo por vez');
        return;
      }

      const file = files[0];
      if (!file) {
        onFileSelect(null, 'Nenhum arquivo foi selecionado');
        return;
      }

      if (!file.type.includes('png') && !file.name.toLowerCase().endsWith('.png')) {
        onFileSelect(null, 'O arquivo arrastado não é um PNG. Por favor, selecione um arquivo PNG');
        return;
      }

      onFileSelect(file);
    },
    [disabled, onFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
      e.target.value = '';
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      document.getElementById('file-upload-input')?.click();
    }
  }, [disabled]);

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn(
        'group relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all duration-200',
        isDragging
          ? 'border-primary bg-primary/5 scale-[1.02]'
          : 'border-border hover:border-primary/50 hover:bg-accent/50',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <input
        id="file-upload-input"
        type="file"
        accept="image/png,.png"
        onChange={handleFileInputChange}
        disabled={disabled}
        className="hidden"
        aria-label="Selecionar arquivo PNG"
      />

      <div
        className={cn(
          'size-16 flex items-center justify-center rounded-full transition-all duration-200',
          isDragging ? 'bg-primary/20 scale-110' : 'bg-muted group-hover:bg-primary/10'
        )}
      >
        {isDragging ? (
          <FileImage className="size-8 text-primary" />
        ) : (
          <Upload className="size-8 text-muted-foreground group-hover:text-primary" />
        )}
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-base font-medium">
          {isDragging ? 'Solte o arquivo aqui' : 'Arraste um arquivo PNG aqui'}
        </p>
        <p className="text-muted-foreground text-sm">
          ou <span className="text-primary font-medium">clique para selecionar</span>
        </p>
      </div>

      <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
        <p>Formatos aceitos: PNG</p>
        <p>Tamanho máximo: 10MB</p>
      </div>
    </div>
  );
}

export { FileUploadZone };
