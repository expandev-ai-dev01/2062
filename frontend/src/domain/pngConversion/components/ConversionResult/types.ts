import type { ConversionResult as ConversionResultType } from '../../types/models';

export interface ConversionResultProps {
  result: ConversionResultType;
  onDownload: () => void;
  onCopy: () => void;
  className?: string;
}
