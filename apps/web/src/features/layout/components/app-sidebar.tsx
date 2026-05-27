import Image from 'next/image';
import Link from 'next/link';
import type { SidebarMenuItem } from '@/features/layout/types/layout-types';
import {
  GridIcon,
  SidebarAssignmentsIcon,
  SidebarGroupsIcon,
  SidebarLibraryIcon,
  SidebarSettingsIcon,
  SidebarSparklesIcon,
  SidebarToolkitIcon,
  VedaLogoMark,
} from '@/shared/components/app-icons';

type AppSidebarProps = {
  menuItems: SidebarMenuItem[];
  activeItemId: string;
};

export const AppSidebar = ({ menuItems, activeItemId }: AppSidebarProps) => {
  const primaryCta = menuItems.find((item) => item.id === 'create-assignment');
  const navItems = menuItems.filter((item) => item.id !== 'create-assignment' && item.id !== 'settings');
  const settingsItem = menuItems.find((item) => item.id === 'settings');
  const navLabelClassName = 'h-[22px] font-heading text-[16px] leading-[140%] tracking-[-0.04em]';
  const getSidebarIcon = (iconName: SidebarMenuItem['iconName']) => {
    if (iconName === 'groups') return <SidebarGroupsIcon />;
    if (iconName === 'assignments') return <SidebarAssignmentsIcon />;
    if (iconName === 'toolkit') return <SidebarToolkitIcon />;
    if (iconName === 'library') return <SidebarLibraryIcon />;
    if (iconName === 'settings') return <SidebarSettingsIcon />;
    return <GridIcon />;
  };

  const primaryCtaNode = primaryCta ? (
    <Link
      href={primaryCta.href}
      className="group mt-[38px] inline-flex h-[42px] w-[251px] rounded-[100px] bg-[linear-gradient(180deg,#FF7950_0%,#C0350A_100%)] p-[4px] shadow-[0_32px_48px_0_rgba(255,255,255,0.20),0_16px_48px_0_rgba(255,255,255,0.12)] transition-all duration-300 ease-out hover:-translate-y-[1px] hover:shadow-[0_20px_30px_0_rgba(0,0,0,0.22),0_10px_24px_0_rgba(0,0,0,0.16)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
    >
      <span className="inline-flex h-[34px] w-[243px] items-center justify-center gap-[10px] rounded-[100px] bg-[#181818] px-[43px] py-[8px] font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-[#FFFFFF] shadow-[inset_0_0_34.5px_0_rgba(255,255,255,0.25),inset_0_-1px_3.5px_0_rgba(27,27,27,0.60)] transition-all duration-300 ease-out group-hover:bg-[#101010] group-hover:shadow-[inset_0_0_40px_0_rgba(255,255,255,0.28),inset_0_-1px_3.5px_0_rgba(27,27,27,0.60)]">
        <SidebarSparklesIcon />
        {primaryCta.label}
      </span>
    </Link>
  ) : null;
  const settingsNode = settingsItem ? (
    <Link
      href={settingsItem.href}
      className="flex h-[40px] w-[256px] items-center gap-[8px] rounded-[8px] px-[12px] py-[9px] text-text-secondary transition-all duration-300 ease-out hover:h-[38px] hover:bg-[#F0F0F0] hover:py-[8px]"
    >
      <span className="flex min-w-0 flex-1 items-center gap-[8px]">
        {getSidebarIcon(settingsItem.iconName)}
        <span className={`${navLabelClassName} font-normal text-text-secondary truncate`}>
          {settingsItem.label}
        </span>
      </span>
    </Link>
  ) : null;

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-[16px] bg-surface-base p-[24px] shadow-[0_32px_48px_0_rgba(0,0,0,0.20),0_16px_48px_0_rgba(0,0,0,0.12)]">
      <div className="flex items-center gap-[12px]">
        <VedaLogoMark className="h-[40px] w-[40px] rounded-[15px]" />
        <h2 className="h-[20px] w-[88px] font-heading text-[28px] font-bold leading-[20px] tracking-[-0.06em] text-text-primary">
          VedaAI
        </h2>
      </div>

      {primaryCtaNode}

      <ul className="mt-[44px] grid h-[184px] w-[256px] gap-[8px]">
        {navItems.map((item) => {
          const isActive = item.id === activeItemId;
          const rowClassName = isActive
            ? 'h-[38px] rounded-[8px] bg-[#F0F0F0] px-[12px] py-[8px] text-text-primary'
            : 'h-[40px] rounded-[8px] px-[12px] py-[9px] text-text-secondary transition-all duration-300 ease-out hover:h-[38px] hover:bg-[#F0F0F0] hover:py-[8px]';
          const labelClassName = isActive
            ? `${navLabelClassName} font-medium text-text-primary`
            : `${navLabelClassName} font-normal text-text-secondary`;
          const itemPaddingClassName = item.badgeCount ? 'pr-[52px]' : '';
          const badgeNode = item.badgeCount ? (
            <span
              className="absolute right-[6px] top-1/2 inline-flex h-[20px] min-w-[34px] -translate-y-1/2 items-center justify-center rounded-[999px] bg-[#FF5623] px-[10px] text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-inverse shadow-[inset_0_0_32.3px_0_rgba(255,161,10,0.25)]"
            >
              {item.badgeCount}
            </span>
          ) : null;

          return (
            <li key={item.id} className="relative">
              <Link
                href={item.href}
                className={`flex w-[256px] items-center gap-[8px] ${rowClassName} ${itemPaddingClassName}`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-[8px]">
                  {getSidebarIcon(item.iconName)}
                  <span className={`${labelClassName} truncate`}>{item.label}</span>
                </span>
              </Link>
              {badgeNode}
            </li>
          );
        })}
      </ul>

      <div className="mt-auto grid gap-[8px]">
        {settingsNode}

        <div className="h-[80px] w-[256px] rounded-[16px] bg-[#F0F0F0] p-[12px]">
          <div className="flex h-[56px] w-[232px] items-center gap-[8px]">
            <Image
              src="/assets/avatars/school-avatar.jpg"
              alt="School avatar"
              width={59}
              height={56}
              className="h-[56px] w-[59px] rounded-[8px] object-cover"
            />
            <div className="h-[44px] w-[165px]">
              <p className="h-[22px] w-[165px] font-heading text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">
                Delhi Public School
              </p>
              <p className="font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-[#5E5E5E]">
                Bokaro Steel City
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
