import { WorkspaceInProgressPage } from '@/features/layout/components/workspace-in-progress-page';

export default function GroupsRoute() {
  return (
    <WorkspaceInProgressPage
      title="My Groups"
      subtitle="Manage student groups and class cohorts."
      activeMenuId="groups"
      moduleTitle="Groups module is in building mode"
      moduleDescription="We are actively building this section. Group creation, member management, and class linking will appear here soon."
    />
  );
}
