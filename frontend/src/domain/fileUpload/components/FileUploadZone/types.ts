export interface FileUploadZoneProps {
  onFileSelect: (file: File | null, error?: string) => void;
  disabled?: boolean;
  className?: string;
}
