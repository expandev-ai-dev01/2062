export interface PdfUploadZoneProps {
  onFileSelect: (file: File | null, error?: string) => void;
  disabled?: boolean;
  className?: string;
}
