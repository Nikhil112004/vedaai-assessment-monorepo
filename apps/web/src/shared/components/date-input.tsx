import type { InputHTMLAttributes } from 'react';
import { CalendarPlusIcon } from '@/shared/components/app-icons';

type DateInputProps = {
  label?: string;
  testId?: string;
  inputType?: 'text' | 'date';
  showCalendarButton?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  iconButtonClassName?: string;
  onCalendarClick?: () => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const DateInput = ({
  id,
  label,
  value,
  testId,
  inputType = 'text',
  showCalendarButton = true,
  onCalendarClick,
  className,
  disabled = false,
  placeholder = 'DD-MM-YYYY',
  wrapperClassName,
  inputClassName,
  iconButtonClassName,
  ...rest
}: DateInputProps) => {
  const resolvedId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasLabel = Boolean(label);
  const labelNode = hasLabel ? (
    <label htmlFor={resolvedId} className="mb-2 block text-body-md font-medium text-text-primary">
      {label}
    </label>
  ) : null;
  const inputFieldClassName = showCalendarButton
    ? 'px-[16px] py-[11px] pr-[52px] text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary'
    : 'px-[16px] py-[11px] text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary';
  const calendarButtonNode = showCalendarButton ? (
    <button
      type="button"
      aria-label="Open calendar"
      onClick={onCalendarClick}
      disabled={disabled}
      className={[
        'absolute right-[10px] top-1/2 inline-flex h-[24px] w-[24px] -translate-y-1/2 items-center justify-center',
        'rounded-pill bg-transparent text-text-primary transition-opacity duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
        'disabled:cursor-not-allowed disabled:opacity-60',
        iconButtonClassName,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <CalendarPlusIcon />
    </button>
  ) : null;

  return (
    <div className={wrapperClassName}>
      {labelNode}
      <div className={['relative w-full', className].filter(Boolean).join(' ')}>
        <input
          id={resolvedId}
          type={inputType}
          inputMode="numeric"
          disabled={disabled}
          value={value}
          data-test-id={testId}
          placeholder={placeholder}
          className={[
            'h-[44px] w-full rounded-[100px] border-[1.25px] border-[#DADADA] bg-surface-base',
            inputFieldClassName,
            'placeholder:text-[#A9A9A9]',
            'transition-all duration-300 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
            'disabled:cursor-not-allowed disabled:bg-[#A9A9A9] disabled:text-text-muted',
            inputClassName,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {calendarButtonNode}
      </div>
    </div>
  );
};
