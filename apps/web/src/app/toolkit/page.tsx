import { WorkspaceInProgressPage } from '@/features/layout/components/workspace-in-progress-page';

export default function ToolkitRoute() {
  return (
    <WorkspaceInProgressPage
      title="AI Teacher's Toolkit"
      subtitle="Explore assistant tools for daily teaching workflows."
      activeMenuId="toolkit"
      moduleTitle="AI Teacher's Toolkit is in building mode"
      moduleDescription="This area is currently under development. Smart utilities, classroom helpers, and content tools will be available here shortly."
    />
  );
}
