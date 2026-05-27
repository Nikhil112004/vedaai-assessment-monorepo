import type { ReactNode } from 'react';

type PageActionsFooterProps = {
  leftAction: ReactNode;
  rightAction: ReactNode;
  className?: string;
};

export const PageActionsFooter = ({ leftAction, rightAction, className }: PageActionsFooterProps) => {
  return (
    <footer className={['flex items-center justify-between gap-sm', className].filter(Boolean).join(' ')}>
      {leftAction}
      {rightAction}
    </footer>
  );
};
