import { WorkspaceInProgressPage } from '@/features/layout/components/workspace-in-progress-page';

export default function LibraryRoute() {
  return (
    <WorkspaceInProgressPage
      title="My Library"
      subtitle="Access saved teaching resources and generated materials."
      activeMenuId="library"
      moduleTitle="Library module is in building mode"
      moduleDescription="This section is currently in progress. Saved files, reusable templates, and previous outputs will be organized here."
    />
  );
}
