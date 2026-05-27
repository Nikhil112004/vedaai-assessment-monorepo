import type { ChangeEvent } from 'react';
import { FileUploadDropzone } from '@/shared/components/file-upload-dropzone';

type UploadSourceCardProps = {
  title: string;
  hint: string;
  supportText?: string;
  isSelected?: boolean;
  accept?: string;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const UploadSourceCard = ({
  title,
  hint,
  supportText,
  isSelected,
  accept,
  onFileChange,
}: UploadSourceCardProps) => {
  return (
    <FileUploadDropzone
      title={title}
      hint={hint}
      supportText={supportText}
      isSelected={isSelected}
      accept={accept}
      onFileChange={onFileChange}
      testId="assignment-source-upload"
    />
  );
};
