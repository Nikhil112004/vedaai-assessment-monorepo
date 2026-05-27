import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PrimaryButtonProps = {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  testId?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const PrimaryButton = ({
  children,
  className,
  disabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  testId,
  type = 'button',
  ...rest
}: PrimaryButtonProps) => {
  const isDisabled = disabled || isLoading;
  const buttonLabel = isLoading ? 'Loading...' : children;
  const leftIconNode = leftIcon ? <span aria-hidden>{leftIcon}</span> : null;
  const rightIconNode = rightIcon ? <span aria-hidden>{rightIcon}</span> : null;
  const widthClassName = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      data-test-id={testId}
      className={[
        'inline-flex h-[46px] items-center justify-center gap-[4px] rounded-[48px] border-[1.5px]',
        'border-transparent bg-brand-secondary px-[24px] py-[12px] text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-inverse',
        'font-heading [border-image:linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(102,102,102,0)_100%)_1]',
        'transition-all duration-300 ease-out hover:opacity-90 active:opacity-80',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
        widthClassName,
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {leftIconNode}
      <span>{buttonLabel}</span>
      {rightIconNode}
    </button>
  );
};
