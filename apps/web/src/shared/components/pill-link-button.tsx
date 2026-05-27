import type { AnchorHTMLAttributes, ReactNode } from 'react';

type PillLinkButtonProps = {
  children: ReactNode;
  leftIcon?: ReactNode;
  disabled?: boolean;
  testId?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>;

export const PillLinkButton = ({
  children,
  className,
  leftIcon,
  disabled = false,
  testId,
  ...rest
}: PillLinkButtonProps) => {
  const resolvedTabIndex = disabled ? -1 : 0;
  const leftIconNode = leftIcon
    ? (
      <span
        aria-hidden
        className="inline-flex shrink-0 items-center justify-center leading-none [&_svg]:block"
      >
        {leftIcon}
      </span>
    )
    : null;
  const disabledClassName = disabled ? 'cursor-not-allowed opacity-60' : '';

  return (
    <a
      data-test-id={testId}
      aria-disabled={disabled}
      tabIndex={resolvedTabIndex}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
        }
      }}
      className={[
        'inline-flex h-[44px] items-center justify-center gap-[4px] rounded-[100px] px-[24px]',
        'font-heading text-[16px] font-medium leading-[22px] tracking-[-0.04em]',
        'transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
        'hover:bg-[#EFEFEF] hover:shadow-[0_12px_28px_rgba(0,0,0,0.20)] hover:scale-[1.03] active:scale-[0.99]',
        disabledClassName,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {leftIconNode}
      <span className="inline-flex items-center">{children}</span>
    </a>
  );
};
