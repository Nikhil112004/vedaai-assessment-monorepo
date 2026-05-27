'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BackArrowIcon, BellIcon, ChevronDownIcon, GridIcon, MenuIcon, VedaLogoMark } from '@/shared/components/app-icons';

type AppHeaderProps = {
  pageTitle: string;
  pageSubtitle?: string;
};

export const AppHeader = ({ pageTitle }: AppHeaderProps) => {
  const router = useRouter();
  const labelClassName = 'font-heading text-[16px] font-semibold leading-[100%] tracking-[-0.04em]';
  const iconButtonClassName = 'relative inline-flex h-[36px] w-[36px] items-center justify-center rounded-[100px] bg-surface-muted text-text-primary';
  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <div className="hidden h-[56px] w-full items-center justify-between gap-[10px] rounded-[16px] bg-[#FFFFFFBF] px-[24px] pr-[12px] xl:flex">
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            aria-label="Go back"
            onClick={handleBackClick}
            className="inline-flex h-[40px] w-[40px] items-center justify-center gap-[12px] rounded-full text-text-primary hover:bg-surface-muted"
          >
            <BackArrowIcon className="h-[24px] w-[24px]" />
          </button>
          <div className="flex h-[20px] w-[801px] items-center gap-[8px]">
            <GridIcon className="h-[20px] w-[20px] text-text-primary" />
            <h1 className={`h-[19px] w-[87px] ${labelClassName} text-text-muted`}>
              {pageTitle}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-[10px]">
          <button
            type="button"
            aria-label="Notifications"
            className={`${iconButtonClassName} hover:bg-surface-muted`}
          >
            <BellIcon className="h-[15px] w-[18px]" />
            <span className="absolute right-[4px] top-[4px] h-[8px] w-[8px] rounded-full bg-status-notification" />
          </button>
          <div className="flex h-[44px] w-[157px] items-center gap-[8px] rounded-[12px] border border-[#FFFFFF80] bg-transparent px-[12px] py-[6px] shadow-[0_32px_48px_0_#00000033,0_16px_48px_0_#0000001F]">
            <div className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-surface-muted">
              <Image
                src="/assets/avatars/john-doe-avatar.svg"
                alt="John Doe avatar"
                width={24}
                height={24}
                className="h-[24px] w-[24px] rounded-full object-cover"
              />
            </div>
            <div className="flex h-[24px] w-[93px] items-center gap-[4px]">
              <p className={`h-[19px] w-[65px] ${labelClassName} text-text-primary`}>
                John Doe
              </p>
              <ChevronDownIcon className="h-[24px] w-[24px] text-text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-[56px] w-full bg-transparent xl:hidden">
        <div className="flex h-[56px] w-full items-center justify-between rounded-[16px] bg-surface-base pl-[12px] pr-[12px]">
          <div className="flex items-center gap-[8px]">
            <VedaLogoMark className="h-[32px] w-[32px] rounded-[8px]" />
            <p className="font-heading text-[20px] font-bold leading-[140%] tracking-[-0.06em] align-middle text-[#303030]">
              VedaAI
            </p>
          </div>
          <div className="flex items-center gap-[10px]">
            <button
              type="button"
              aria-label="Notifications"
              className={iconButtonClassName}
            >
              <BellIcon className="h-[15px] w-[18px]" />
              <span className="absolute right-[4px] top-[4px] h-[8px] w-[8px] rounded-full bg-status-notification" />
            </button>
            <Image
              src="/assets/avatars/john-doe-avatar.svg"
              alt="John Doe avatar"
              width={32}
              height={32}
              className="h-[32px] w-[32px] rounded-full object-cover"
            />
            <button type="button" aria-label="Open menu" className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-text-primary">
              <MenuIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
