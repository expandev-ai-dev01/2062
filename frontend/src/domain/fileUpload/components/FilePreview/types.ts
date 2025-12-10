import type { UploadedFile } from '../../types/models';

export interface FilePreviewProps {
  file: UploadedFile;
  onRemove: () => void;
  onReplace: () => void;
  className?: string;
}
