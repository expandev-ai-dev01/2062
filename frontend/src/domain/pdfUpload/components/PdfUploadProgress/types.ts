import type { PdfUploadProgress } from '../../types/models';

export interface PdfUploadProgressProps {
  progress: PdfUploadProgress;
  fileName: string;
  onCancel?: () => void;
  className?: string;
}
