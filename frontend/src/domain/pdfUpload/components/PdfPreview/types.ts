import type { UploadedPdf } from '../../types/models';

export interface PdfPreviewProps {
  file: UploadedPdf;
  onRemove: () => void;
  onReplace: () => void;
  className?: string;
}
