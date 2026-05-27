import { WorkspaceInProgressPage } from '@/features/layout/components/workspace-in-progress-page';

export default function SettingsRoute() {
  return (
    <WorkspaceInProgressPage
      title="Settings"
      subtitle="Control workspace preferences and account behavior."
      activeMenuId="settings"
      moduleTitle="Settings module is in building mode"
      moduleDescription="We are still building this section. Workspace preferences, notification controls, and account-level options will be added here."
    />
  );
}
