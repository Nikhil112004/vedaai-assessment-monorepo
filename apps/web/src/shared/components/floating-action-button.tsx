import type { ButtonHTMLAttributes, ReactNode } from 'react';

type FloatingActionButtonProps = {
  icon: ReactNode;
  label: string;
  testId?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>;

export const FloatingActionButton = ({
  icon,
  label,
  className,
  disabled = false,
  testId,
  type = 'button',
  ...rest
}: FloatingActionButtonProps) => {
  const classNames = [
    'inline-flex h-[48px] w-[48px] items-center justify-center gap-button-content-gap rounded-pill',
    'bg-surface-base text-brand-primary shadow-floating-fab',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
    'disabled:cursor-not-allowed disabled:opacity-60',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={label}
      data-test-id={testId}
      className={classNames}
      {...rest}
    >
      <span aria-hidden>{icon}</span>
    </button>
  );
};
