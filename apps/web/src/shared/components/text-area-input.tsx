import type { TextareaHTMLAttributes } from 'react';
import type { ReactNode } from 'react';

type TextAreaInputProps = {
  label?: string;
  testId?: string;
  wrapperClassName?: string;
  textAreaClassName?: string;
  isDashed?: boolean;
  trailingAction?: ReactNode;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaInput = ({
  id,
  label,
  testId,
  className,
  isDashed = true,
  wrapperClassName,
  textAreaClassName,
  trailingAction,
  placeholder = 'e.g Generate a question paper for 3 hour exam duration...',
  ...rest
}: TextAreaInputProps) => {
  const resolvedId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  const hasLabel = Boolean(label);
  const hasTrailingAction = Boolean(trailingAction);
  const labelNode = hasLabel ? (
    <label htmlFor={resolvedId} className="mb-2 block text-body-md font-medium text-text-primary">
      {label}
    </label>
  ) : null;
  const trailingActionNode = hasTrailingAction
    ? <div className="absolute bottom-[16px] right-[16px]">{trailingAction}</div>
    : null;

  return (
    <div className={wrapperClassName}>
      {labelNode}
      <div className="relative">
        <textarea
          id={resolvedId}
          data-test-id={testId}
          placeholder={placeholder}
          className={[
            'h-[102px] w-full rounded-[16px] border-[1.25px] bg-surface-base p-[16px]',
            'text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary',
            'placeholder:text-[#30303099]',
            isDashed ? 'border-dashed border-[#DADADA]' : 'border-solid border-[#DADADA]',
            'transition-all duration-300 ease-out',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
            'disabled:cursor-not-allowed disabled:opacity-60',
            hasTrailingAction ? 'pr-[60px]' : '',
            textAreaClassName,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {trailingActionNode}
      </div>
    </div>
  );
};
