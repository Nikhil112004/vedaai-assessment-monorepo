import type { ChangeEvent } from 'react';
import { FileUploadCloudIcon } from '@/shared/components/app-icons';

type FileUploadDropzoneProps = {
  title: string;
  hint: string;
  supportText?: string;
  buttonLabel?: string;
  isSelected?: boolean;
  testId?: string;
  accept?: string;
  onFileChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const FileUploadDropzone = ({
  title,
  hint,
  supportText,
  buttonLabel = 'Browse Files',
  isSelected = false,
  testId,
  accept,
  onFileChange,
}: FileUploadDropzoneProps) => {
  const titleClassName = isSelected
    ? 'font-heading text-[16px] font-semibold leading-[140%] tracking-[-0.04em] text-text-primary'
    : 'font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary';
  const supportTextNode = supportText ? (
    <p className="w-full text-center font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-[#30303099]">{supportText}</p>
  ) : null;

  return (
    <section className="grid w-full gap-[12px] lg:min-h-[236px]">
      <div className="grid w-full gap-[16px] rounded-[24px] border-[1.75px] border-dashed border-[#00000033] bg-surface-base px-[16px] py-[20px] text-center md:px-[24px] md:py-[24px] lg:min-h-[202px] lg:px-[32px]">
        <div className="mx-auto inline-flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-surface-base">
          <FileUploadCloudIcon />
        </div>

        <div className="grid w-full gap-[4px]">
          <h3 className={`${titleClassName} truncate`}>{title}</h3>
          <p className="font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-[#A9A9A9]">{hint}</p>
        </div>

        <label className="mx-auto inline-flex h-[36px] w-[127px] cursor-pointer items-center justify-center gap-[4px] rounded-[100px] bg-[#F6F6F6] px-[24px] py-[8px] font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary transition-all duration-300 ease-out hover:bg-[#EFEFEF] hover:shadow-[0_8px_18px_rgba(0,0,0,0.12)] active:scale-[0.99] focus-within:outline-none focus-within:ring-2 focus-within:ring-border-strong">
          {buttonLabel}
          <input className="sr-only" data-test-id={testId} type="file" accept={accept} onChange={onFileChange} />
        </label>
      </div>

      {supportTextNode}
    </section>
  );
};
