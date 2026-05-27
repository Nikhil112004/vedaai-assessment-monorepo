import { AppWorkspaceLayout } from '@/features/layout/components/app-workspace-layout';

type WorkspaceInProgressPageProps = {
  title: string;
  subtitle: string;
  activeMenuId: string;
  moduleTitle: string;
  moduleDescription: string;
};

export const WorkspaceInProgressPage = ({
  title,
  subtitle,
  activeMenuId,
  moduleTitle,
  moduleDescription,
}: WorkspaceInProgressPageProps) => {
  return (
    <AppWorkspaceLayout title={title} subtitle={subtitle} activeMenuId={activeMenuId}>
      <section className="mx-[12px] grid gap-[12px]">
        <section className="rounded-[24px] bg-surface-base p-card-padding">
          <span className="inline-flex rounded-[100px] bg-surface-muted px-[12px] py-[8px] font-heading text-[12px] font-medium leading-[140%] tracking-[-0.04em] text-text-secondary">
            Currently in progress
          </span>
          <div className="mt-[12px] grid gap-[8px]">
            <h2 className="font-heading text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">
              {moduleTitle}
            </h2>
            <p className="max-w-[700px] font-heading text-[16px] font-normal leading-[140%] tracking-[-0.04em] text-text-secondary">
              {moduleDescription}
            </p>
          </div>
        </section>
      </section>
    </AppWorkspaceLayout>
  );
};
