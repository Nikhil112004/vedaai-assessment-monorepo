import type { MainLayoutProps } from '@/features/layout/types/layout-types';

export const MainLayoutShell = ({ header, sidebar, mobileNav, mobileOverlay, children }: MainLayoutProps) => {
  const sidebarNode = sidebar
    ? <aside className="hidden h-[calc(100vh-24px)] w-[304px] shrink-0 overflow-hidden xl:block">{sidebar}</aside>
    : null;
  const mobileNavNode = mobileNav ? <nav className="xl:hidden">{mobileNav}</nav> : null;
  const mobileOverlayNode = mobileOverlay ? <div className="xl:hidden">{mobileOverlay}</div> : null;

  return (
    <div className="h-screen overflow-hidden bg-surface-page text-text-primary">
      <div className="mx-auto flex h-full w-full max-w-[1920px] items-stretch gap-0 px-[10px] py-[10px] xl:gap-[11px] xl:px-[12px] xl:py-[12px]">
        {sidebarNode}
        <div className="flex min-h-0 min-w-0 flex-1 self-stretch flex-col gap-[8px] xl:gap-[22px]">
          <header className="shrink-0">{header}</header>
          <main className="hide-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      {mobileNavNode}
      {mobileOverlayNode}
    </div>
  );
};
