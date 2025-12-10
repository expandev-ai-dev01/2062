import type { FileUploadProgress } from '../../types/models';

export interface UploadProgressProps {
  progress: FileUploadProgress;
  fileName: string;
  className?: string;
}
