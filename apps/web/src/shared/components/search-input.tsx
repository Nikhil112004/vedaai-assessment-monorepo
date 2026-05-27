import type { InputHTMLAttributes } from 'react';

type SearchInputProps = {
  testId?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const SearchInput = ({ className, testId, ...rest }: SearchInputProps) => {
  return (
    <input
      type="search"
      data-test-id={testId}
      className={[
        'h-[44px] w-full rounded-[100px] border-[1.25px] border-border-subtle bg-surface-base px-[16px] py-[11px]',
        'text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary placeholder:text-text-secondary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
};
