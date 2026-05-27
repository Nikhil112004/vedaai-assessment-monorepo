import type { SidebarMenuItem } from '@/features/layout/types/layout-types';

export const DESKTOP_SIDEBAR_MENU: SidebarMenuItem[] = [
  { id: 'create-assignment', label: 'Create Assignment', href: '/assignments/create', iconName: 'create' },
  { id: 'home', label: 'Home', href: '/', iconName: 'home' },
  { id: 'groups', label: 'My Groups', href: '/groups', iconName: 'groups' },
  { id: 'assignments', label: 'Assignments', href: '/assignments', iconName: 'assignments' },
  { id: 'toolkit', label: "AI Teacher's Toolkit", href: '/toolkit', iconName: 'toolkit' },
  { id: 'library', label: 'My Library', href: '/library', iconName: 'library' },
  { id: 'settings', label: 'Settings', href: '/settings', iconName: 'settings' },
];

export const MOBILE_BOTTOM_MENU: SidebarMenuItem[] = [
  { id: 'home', label: 'Home', href: '/', iconName: 'home' },
  { id: 'assignments', label: 'Assignments', href: '/assignments', iconName: 'assignments' },
  { id: 'library', label: 'Library', href: '/library', iconName: 'library' },
  { id: 'toolkit', label: 'AI Toolkit', href: '/toolkit', iconName: 'toolkit' },
];
