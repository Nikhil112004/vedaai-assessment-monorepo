'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppHeader } from '@/features/layout/components/app-header';
import { AppSidebar } from '@/features/layout/components/app-sidebar';
import { MainLayoutShell } from '@/features/layout/components/main-layout-shell';
import { MobileBottomNav } from '@/features/layout/components/mobile-bottom-nav';
import { DESKTOP_SIDEBAR_MENU, MOBILE_BOTTOM_MENU } from '@/shared/constants/layout-menu';
import type { SidebarMenuItem } from '@/features/layout/types/layout-types';
import { assignmentApi } from '@/lib/api/assignment-api';

type AppWorkspaceLayoutProps = {
  title: string;
  subtitle?: string;
  activeMenuId: string;
  menuBadgeCounts?: Partial<Record<SidebarMenuItem['id'], number>>;
  mobileOverlay?: ReactNode;
  children: ReactNode;
};

export const AppWorkspaceLayout = ({
  title,
  subtitle,
  activeMenuId,
  menuBadgeCounts,
  mobileOverlay,
  children,
}: AppWorkspaceLayoutProps) => {
  const [assignmentCount, setAssignmentCount] = useState<number | null>(null);

  useEffect(() => {
    const loadAssignmentCount = async () => {
      try {
        const assignments = await assignmentApi.listAssignments();
        setAssignmentCount(assignments.length);
      } catch {
        setAssignmentCount(null);
      }
    };

    void loadAssignmentCount();
  }, []);

  const desktopMenuItems = useMemo(
    () =>
      DESKTOP_SIDEBAR_MENU.map((item) => {
        if (item.id === 'assignments') {
          const resolvedCount = menuBadgeCounts?.assignments ?? assignmentCount ?? item.badgeCount ?? 0;
          return {
            ...item,
            badgeCount: resolvedCount > 0 ? resolvedCount : undefined,
          };
        }

        return {
          ...item,
          badgeCount: menuBadgeCounts?.[item.id] ?? item.badgeCount,
        };
      }),
    [assignmentCount, menuBadgeCounts]
  );

  return (
    <MainLayoutShell
      header={<AppHeader pageTitle={title} pageSubtitle={subtitle} />}
      sidebar={<AppSidebar menuItems={desktopMenuItems} activeItemId={activeMenuId} />}
      mobileNav={<MobileBottomNav menuItems={MOBILE_BOTTOM_MENU} activeItemId={activeMenuId} />}
      mobileOverlay={mobileOverlay}
    >
      {children}
    </MainLayoutShell>
  );
};
