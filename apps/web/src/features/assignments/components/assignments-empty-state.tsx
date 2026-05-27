import Image from 'next/image';
import { PlusIcon } from '@/shared/components/app-icons';

type AssignmentsEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onActionClick?: () => void;
};

export const AssignmentsEmptyState = ({ title, description, actionLabel, onActionClick }: AssignmentsEmptyStateProps) => {
  const headingClassName = 'font-heading text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary';
  const bodyClassName = 'font-heading text-[16px] font-normal leading-[140%] tracking-[-0.04em] text-center align-middle text-text-secondary';
  const ctaClassName =
    'inline-flex h-[46px] w-[277px] items-center justify-center gap-[4px] rounded-[48px] border-[1.5px] border-border-default bg-brand-secondary px-[24px] py-[12px] font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-inverse transition-all duration-300 ease-out hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong';

  return (
    <section className="relative min-h-[66vh] w-full bg-transparent px-0 pb-[190px] pt-[12px] xl:h-[678px] xl:justify-between xl:rounded-[32px] xl:bg-surface-muted xl:p-[24px] xl:pb-[24px]">
      <div className="mx-auto hidden max-w-[486px] text-center xl:flex xl:h-[678px] xl:w-[486px] xl:flex-col xl:items-center xl:justify-center">
        <div className="flex w-[486px] flex-col items-center">
          <Image
            src="/assets/illustrations/assignments-empty-state.svg"
            alt=""
            aria-hidden
            width={286}
            height={240}
            className="h-[240px] w-[286.22px]"
          />
          <div className="mt-[10px] flex h-[96px] w-[486px] flex-col items-center gap-[2px]">
            <h3 className={headingClassName}>{title}</h3>
            <p className={`h-[66px] w-[486px] ${bodyClassName}`}>{description}</p>
          </div>
        </div>

        <button type="button" onClick={onActionClick} className={`${ctaClassName} xl:mt-[20px]`}>
          <PlusIcon className="h-[18px] w-[18px]" />
          {actionLabel}
        </button>
      </div>

      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-1/2 z-20 h-[157px] w-[393px] max-w-full -translate-x-1/2 bg-[rgba(240,240,240,0.05)] [backdrop-filter:blur(4px)] xl:hidden"
      />
      <div className="mt-[28px] grid justify-items-center text-center xl:hidden">
        <Image
          src="/assets/illustrations/assignments-empty-state.svg"
          alt=""
          aria-hidden
          width={240}
          height={190}
          className="h-[206px] w-[258px]"
        />
        <h3 className={`mt-[28px] ${headingClassName}`}>{title}</h3>
        <p className={`mt-[8px] max-w-[362px] ${bodyClassName}`}>{description}</p>
        <div className="mt-[24px]">
          <button type="button" onClick={onActionClick} className={ctaClassName}>
            <PlusIcon className="h-[18px] w-[18px]" />
            {actionLabel}
          </button>
        </div>
      </div>
    </section>
  );
};
