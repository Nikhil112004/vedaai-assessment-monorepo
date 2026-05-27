import { DashboardActionBanner } from '@/features/dashboard/components/dashboard-action-banner';

export const DashboardPageContent = () => {
  return (
    <div className="grid gap-md">
      <DashboardActionBanner title="AI Teacher Toolkit" actionLabel="Download as PDF" />
      <section className="rounded-[24px] border border-border-subtle bg-surface-panel p-card-padding">
        <h3 className="font-heading text-body-md font-bold text-text-primary">Dashboard Content Placeholder</h3>
      </section>
    </div>
  );
};
