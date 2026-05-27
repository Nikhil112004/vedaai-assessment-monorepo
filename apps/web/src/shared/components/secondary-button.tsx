import type { ButtonHTMLAttributes, ReactNode } from 'react';

type SecondaryButtonProps = {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  testId?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export const SecondaryButton = ({
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
}: SecondaryButtonProps) => {
  const isDisabled = disabled || isLoading;
  const buttonLabel = isLoading ? 'Loading...' : children;
  const leftIconNode = leftIcon ? <span aria-hidden>{leftIcon}</span> : null;
  const rightIconNode = rightIcon ? <span aria-hidden>{rightIcon}</span> : null;
  const widthClassName = fullWidth ? 'w-full' : 'w-[134px]';

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading}
      data-test-id={testId}
      className={[
        'inline-flex h-[46px] items-center justify-center gap-[4px] rounded-[48px]',
        'bg-surface-base px-[24px] py-[12px] text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary',
        'font-heading transition-all duration-300 ease-out hover:opacity-90 active:opacity-80',
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
