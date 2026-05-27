'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { DotsVerticalIcon } from '@/shared/components/app-icons';
import { APP_ROUTES } from '@/shared/constants/app-routes';

type AssignmentCardProps = {
  assignmentId: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  onDelete: () => void;
  isDeleting?: boolean;
  actionSlot?: ReactNode;
};

export const AssignmentCard = ({
  assignmentId,
  title,
  assignedDate,
  dueDate,
  onDelete,
  isDeleting = false,
  actionSlot,
}: AssignmentCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuHoverOpen, setIsMenuHoverOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const menuId = `assignment-menu-${assignmentId}`;
  const questionPaperLink = useMemo(
    () => APP_ROUTES.questionPaper.replace('[assignmentId]', assignmentId),
    [assignmentId]
  );
  const isMenuVisible = isMenuOpen || isMenuHoverOpen;
  const deleteActionLabel = isDeleting ? 'Deleting...' : 'Delete';

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (!menuRef.current) return;
      const target = event.target as Node;
      if (!menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  const menuNode = isMenuVisible ? (
    <div
      id={menuId}
      role="menu"
      aria-label="Assignment options"
      className="absolute right-[0px] top-[30px] z-10 grid h-[84px] w-[140px] gap-[4px] rounded-[16px] bg-[#FFFFFF] p-[8px] shadow-[0_32px_48px_0_#0000000D,0_16px_48px_0_#00000033]"
    >
      <Link
        href={questionPaperLink}
        onClick={() => setIsMenuOpen(false)}
        role="menuitem"
        className="inline-flex h-[32px] w-[124px] items-center rounded-[8px] px-[8px] font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-[#303030] transition-colors duration-300 ease-out hover:bg-[#F6F6F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
      >
        View Assignment
      </Link>
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          if (isDeleting) return;
          onDelete();
          setIsMenuOpen(false);
        }}
        disabled={isDeleting}
        className="inline-flex h-[32px] w-[124px] items-center rounded-[8px] bg-transparent px-[8px] text-left font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-[#C53535] transition-colors duration-300 ease-out hover:bg-[#FEE2E2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCA5A5] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {deleteActionLabel}
      </button>
    </div>
  ) : null;

  return (
    <article className="relative h-[162px] min-h-[162px] w-full rounded-[24px] bg-surface-base p-[24px]">
      <div className="flex h-[114px] w-full flex-col justify-between">
        <div className="flex h-[29px] w-full items-start justify-between">
          <h3 className="font-heading text-[24px] font-extrabold leading-[120%] tracking-[-0.04em] text-[#303030]">
            <span className="underline decoration-[1px] underline-offset-[4px]">{title}</span>
          </h3>
          <div
            className="relative"
            ref={menuRef}
            onMouseEnter={() => setIsMenuHoverOpen(true)}
            onMouseLeave={() => {
              setIsMenuHoverOpen(false);
              setIsMenuOpen(false);
            }}
            onFocus={() => setIsMenuOpen(true)}
            onBlur={(event) => {
              const nextFocused = event.relatedTarget as Node | null;
              if (menuRef.current && nextFocused && menuRef.current.contains(nextFocused)) {
                return;
              }
              setIsMenuHoverOpen(false);
              setIsMenuOpen(false);
            }}
          >
            <div>
              <button
                type="button"
                aria-label="Assignment actions"
                aria-controls={menuId}
                aria-expanded={isMenuVisible}
                aria-haspopup="menu"
                onClick={() => setIsMenuOpen((previous) => !previous)}
                className="inline-flex h-[24px] w-[24px] items-center justify-center rounded-[8px] transition-colors duration-300 ease-out hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
              >
                <DotsVerticalIcon />
              </button>
            </div>
            {menuNode}
          </div>
        </div>
        <div className="flex h-[19px] w-full items-center justify-between">
          <span className="font-heading text-[16px] leading-[120%] tracking-[-0.04em] text-[#303030]">
            <span className="font-extrabold">Assigned on : </span>
            <span className="font-normal"> {assignedDate}</span>
          </span>
          <span className="font-heading text-[16px] leading-[120%] tracking-[-0.04em] text-[#303030]">
            <span className="font-extrabold">Due : </span>
            <span className="font-normal"> {dueDate}</span>
          </span>
        </div>
      </div>
      {actionSlot}
    </article>
  );
};
