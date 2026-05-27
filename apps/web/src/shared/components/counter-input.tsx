import { CounterMinusIcon, CounterPlusIcon } from '@/shared/components/app-icons';

type CounterInputProps = {
  value: number;
  label: string;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  testId?: string;
  className?: string;
};

export const CounterInput = ({
  value,
  label,
  onIncrement,
  onDecrement,
  min,
  max,
  testId,
  className,
}: CounterInputProps) => {
  const canDecrement = min === undefined || value > min;
  const canIncrement = max === undefined || value < max;

  return (
    <div
      className={[
        'inline-flex h-[44px] w-full items-center justify-between rounded-[100px] bg-surface-base px-[8px] py-[11px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      data-test-id={testId}
      aria-label={label}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={`Decrease ${label}`}
        className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-pill text-text-secondary transition-colors duration-300 ease-out hover:text-text-primary disabled:opacity-40"
      >
        <CounterMinusIcon />
      </button>

      <span className="text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary">{value}</span>

      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={`Increase ${label}`}
        className="inline-flex h-[16px] w-[16px] items-center justify-center rounded-pill text-text-secondary transition-colors duration-300 ease-out hover:text-text-primary disabled:opacity-40"
      >
        <CounterPlusIcon />
      </button>
    </div>
  );
};
