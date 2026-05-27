type DashboardActionBannerProps = {
  title: string;
  actionLabel: string;
};

export const DashboardActionBanner = ({ title, actionLabel }: DashboardActionBannerProps) => {
  return (
    <section className="rounded-[24px] border border-border-subtle bg-surface-panel p-card-padding">
      <div className="flex items-center justify-between gap-[12px]">
        <h2 className="font-heading text-body-md font-bold text-text-primary">{title}</h2>
        <button
          type="button"
          className="rounded-[100px] bg-brand-secondary px-[16px] py-[10px] font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-inverse"
        >
          {actionLabel}
        </button>
      </div>
    </section>
  );
};
