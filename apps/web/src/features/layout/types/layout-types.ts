import type { ReactNode } from 'react';

export type MainLayoutProps = {
  header: ReactNode;
  sidebar?: ReactNode;
  mobileNav?: ReactNode;
  mobileOverlay?: ReactNode;
  children: ReactNode;
};

export type SidebarMenuItem = {
  id: string;
  label: string;
  href: string;
  iconName: string;
  badgeCount?: number;
};

export type HeaderAction = {
  id: string;
  label: string;
  iconName: string;
};
