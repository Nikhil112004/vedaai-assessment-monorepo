import type { ButtonHTMLAttributes } from 'react';
import { ChevronDownIcon, CloseIcon } from '@/shared/components/app-icons';

type QuestionTypeSelectProps = {
  value: string;
  label?: string;
  onSelectClick?: () => void;
  onRemoveClick?: () => void;
  showRemove?: boolean;
  testId?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const QuestionTypeSelect = ({
  value,
  label = 'Question Type',
  onSelectClick,
  onRemoveClick,
  showRemove = true,
  testId,
  className,
  disabled = false,
  type = 'button',
  ...rest
}: QuestionTypeSelectProps) => {
  const removeButtonNode = showRemove ? (
    <button
      type="button"
      aria-label="Remove question type"
      onClick={onRemoveClick}
      disabled={disabled}
      className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-pill text-text-primary opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <CloseIcon />
    </button>
  ) : null;

  return (
    <div className={['flex h-[44px] w-full items-center gap-[12px] opacity-100', className].filter(Boolean).join(' ')}>
      <button
        type={type}
        disabled={disabled}
        data-test-id={testId}
        aria-label={label}
        onClick={onSelectClick}
        className={[
          'inline-flex h-[44px] w-full items-center justify-between rounded-[100px]',
          'bg-surface-base px-[16px] py-[11px]',
          'text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
          'disabled:cursor-not-allowed disabled:opacity-60',
        ].join(' ')}
        {...rest}
      >
        <span>{value}</span>
        <span aria-hidden className="inline-flex h-[16px] w-[16px] items-center justify-center opacity-100">
          <ChevronDownIcon />
        </span>
      </button>

      {removeButtonNode}
    </div>
  );
};
