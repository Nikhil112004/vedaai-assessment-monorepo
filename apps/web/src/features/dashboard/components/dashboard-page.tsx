import { AppWorkspaceLayout } from '@/features/layout/components/app-workspace-layout';
import { DashboardPageContent } from '@/features/dashboard/components/dashboard-page-content';

export const DashboardPage = () => {
  return (
    <AppWorkspaceLayout
      title="Home"
      subtitle="Overview of your workspace"
      activeMenuId="home"
    >
      <DashboardPageContent />
    </AppWorkspaceLayout>
  );
};
