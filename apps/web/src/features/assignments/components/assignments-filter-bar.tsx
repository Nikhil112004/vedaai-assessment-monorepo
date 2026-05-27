import { useEffect, useRef, useState } from 'react';
import { AssignmentsFilterIcon, AssignmentsSearchIcon } from '@/shared/components/app-icons';
import { SearchInput } from '@/shared/components/search-input';
import type { AssignmentFilter } from '@/features/assignments/types/assignment-list-types';

type FilterOption = {
  id: AssignmentFilter;
  label: string;
};

type AssignmentsFilterBarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilter: AssignmentFilter;
  onFilterChange: (value: AssignmentFilter) => void;
};

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All Assignments' },
  { id: 'due_today', label: 'Due Today' },
  { id: 'due_this_week', label: 'Due This Week' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'assigned_this_week', label: 'Assigned This Week' },
];

export const AssignmentsFilterBar = ({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: AssignmentsFilterBarProps) => {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFilterMenuOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (!filterMenuRef.current) return;
      if (!filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFilterMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isFilterMenuOpen]);

  const filterMenuNode = isFilterMenuOpen ? (
    <div
      role="menu"
      aria-label="Assignment filters"
      className="absolute left-0 top-[30px] z-[30] grid min-w-[200px] gap-[4px] rounded-[12px] border border-[#00000014] bg-surface-base p-[6px] shadow-[0_16px_40px_rgba(0,0,0,0.15)]"
    >
      {FILTER_OPTIONS.map((option) => {
        const isActiveOption = option.id === activeFilter;
        const optionClassName = isActiveOption
          ? 'inline-flex h-[32px] items-center rounded-[8px] bg-[#F0F0F0] px-[10px] text-left font-heading text-[13px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary'
          : 'inline-flex h-[32px] items-center rounded-[8px] px-[10px] text-left font-heading text-[13px] font-medium leading-[140%] tracking-[-0.04em] text-text-secondary transition-colors duration-300 ease-out hover:bg-[#F0F0F0]';

        return (
          <button
            key={option.id}
            type="button"
            role="menuitemradio"
            aria-checked={isActiveOption}
            onClick={() => {
              onFilterChange(option.id);
              setIsFilterMenuOpen(false);
            }}
            className={`${optionClassName} hover:!transform-none hover:!shadow-none`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  ) : null;

  return (
    <section className="h-[64px] w-full rounded-[20px] bg-surface-base px-[16px] max-[1200px]:py-[10px]">
      <div className="flex h-full min-w-0 items-center justify-between gap-[12px]">
        <div className="relative" ref={filterMenuRef}>
          <button
            className="inline-flex h-[20px] shrink-0 items-center justify-start gap-[8px] whitespace-nowrap text-left font-heading text-[14px] font-bold leading-[140%] tracking-[-0.04em] text-[#A9A9A9] hover:!transform-none hover:!shadow-none"
            type="button"
            aria-label="Filter assignments"
            aria-expanded={isFilterMenuOpen}
            aria-haspopup="menu"
            onClick={() => setIsFilterMenuOpen((prev) => !prev)}
          >
            <span className="inline-flex h-[20px] w-[20px] items-center justify-center rounded-[6px] transition-colors duration-300 ease-out hover:bg-[#F0F0F0]">
              <AssignmentsFilterIcon />
            </span>
            <span className="inline-block leading-[20px]">Filter By</span>
          </button>
          {filterMenuNode}
        </div>
        <div className="relative h-[44px] w-[228px] flex-none xl:w-[380px]">
          <span aria-hidden className="pointer-events-none absolute left-[16px] top-1/2 -translate-y-1/2">
            <AssignmentsSearchIcon className="h-[20px] w-[20px]" />
          </span>
          <SearchInput
            aria-label="Search assignments"
            placeholder={searchPlaceholder}
            testId="assignments-search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-[44px] w-full rounded-[100px] border border-[#00000033] px-[16px] py-[11px] pl-[46px] font-heading text-[14px] font-bold leading-[140%] tracking-[-0.04em] text-[#A9A9A9] transition-all duration-300 ease-out placeholder:font-heading placeholder:text-[14px] placeholder:font-bold placeholder:leading-[140%] placeholder:tracking-[-0.04em] placeholder:text-[#A9A9A9]"
          />
        </div>
      </div>
    </section>
  );
};
