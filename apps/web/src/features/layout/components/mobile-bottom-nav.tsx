import Link from 'next/link';
import type { SidebarMenuItem } from '@/features/layout/types/layout-types';
import {
  GridIcon,
  SidebarAssignmentsIcon,
  SidebarLibraryIcon,
  SidebarToolkitIcon,
} from '@/shared/components/app-icons';

type MobileBottomNavProps = {
  menuItems: SidebarMenuItem[];
  activeItemId: string;
};

export const MobileBottomNav = ({ menuItems, activeItemId }: MobileBottomNavProps) => {
  const itemBaseClassName =
    'flex h-full w-full flex-col items-center justify-center gap-[4px] rounded-[12px] px-[4px]';
  const itemLabelClassName = 'font-heading text-[12px] font-medium leading-[14px] tracking-[-0.04em] text-center';
  const getIconByMenuType = (iconName: SidebarMenuItem['iconName'], iconClassName: string) => {
    if (iconName === 'assignments') return <SidebarAssignmentsIcon className={iconClassName} />;
    if (iconName === 'library') return <SidebarLibraryIcon className={iconClassName} />;
    if (iconName === 'toolkit') return <SidebarToolkitIcon className={iconClassName} />;
    return <GridIcon className={iconClassName} />;
  };

  return (
    <ul className="fixed bottom-[14px] left-[10px] right-[10px] z-20 grid h-[72px] w-auto grid-cols-4 rounded-[24px] bg-surface-inverse px-[14px] py-[8px] text-text-inverse shadow-[0_32px_48px_0_rgba(0,0,0,0.20),0_16px_48px_0_rgba(0,0,0,0.12)] xl:hidden">
      {menuItems.map((item) => {
        const isActive = item.id === activeItemId;
        const linkClassName = isActive
          ? `${itemBaseClassName} text-text-inverse`
          : `${itemBaseClassName} text-[rgba(255,255,255,0.35)]`;
        const iconClassName = isActive ? 'h-[20px] w-[20px]' : 'h-[20px] w-[20px]';
        const labelClassName = isActive
          ? `${itemLabelClassName} text-text-inverse`
          : `${itemLabelClassName} text-[rgba(255,255,255,0.35)]`;
        const iconNode = getIconByMenuType(item.iconName, iconClassName);

        return (
          <li key={item.id} className="min-w-0">
            <Link href={item.href} className={linkClassName} aria-current={isActive ? 'page' : undefined}>
              <span className="inline-flex h-[20px] w-[20px] items-center justify-center">{iconNode}</span>
              <span className={labelClassName}>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
