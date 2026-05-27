'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AssignmentsEmptyState } from '@/features/assignments/components/assignments-empty-state';
import { AssignmentsFilterBar } from '@/features/assignments/components/assignments-filter-bar';
import { AssignmentsList } from '@/features/assignments/components/assignments-list';
import type { AssignmentFilter, AssignmentListItem } from '@/features/assignments/types/assignment-list-types';
import { AppWorkspaceLayout } from '@/features/layout/components/app-workspace-layout';
import { assignmentApi } from '@/lib/api/assignment-api';
import { APP_ROUTES } from '@/shared/constants/app-routes';
import { PlusIcon } from '@/shared/components/app-icons';
import { FloatingActionButton } from '@/shared/components/floating-action-button';

type AssignmentsPageProps = {
  items?: AssignmentListItem[];
};

export const AssignmentsPage = ({ items = [] }: AssignmentsPageProps) => {
  const router = useRouter();
  const [assignmentItems, setAssignmentItems] = useState<AssignmentListItem[]>(items);
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AssignmentFilter>('all');
  const isEmpty = assignmentItems.length === 0;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const filteredAssignments = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const weekBoundary = new Date(today);
    weekBoundary.setDate(today.getDate() + 7);

    return assignmentItems.filter((item) => {
      const searchableValue = [
        item.title,
        item.assignedDate,
        item.dueDate,
        item.searchableText ?? '',
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !normalizedQuery || searchableValue.includes(normalizedQuery);
      if (!matchesSearch) return false;

      const dueDate = new Date(item.dueDateIso);
      const assignedDate = new Date(item.assignedDateIso);
      const hasValidDueDate = !Number.isNaN(dueDate.getTime());
      const hasValidAssignedDate = !Number.isNaN(assignedDate.getTime());

      if (activeFilter === 'due_today') {
        if (!hasValidDueDate) return false;
        return dueDate >= today && dueDate < tomorrow;
      }

      if (activeFilter === 'due_this_week') {
        if (!hasValidDueDate) return false;
        return dueDate >= today && dueDate < weekBoundary;
      }

      if (activeFilter === 'overdue') {
        if (!hasValidDueDate) return false;
        return dueDate < today;
      }

      if (activeFilter === 'assigned_this_week') {
        if (!hasValidAssignedDate) return false;
        return assignedDate >= today && assignedDate < weekBoundary;
      }

      return true;
    });
  }, [activeFilter, assignmentItems, searchQuery]);
  const assignmentCount = assignmentItems.length;

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (deletingAssignmentId) return;
    setDeletingAssignmentId(assignmentId);
    try {
      await assignmentApi.deleteAssignment(assignmentId);
      setAssignmentItems((previousItems) => previousItems.filter((item) => item.id !== assignmentId));
    } catch {
      // No-op: UI state remains unchanged when delete fails.
    } finally {
      setDeletingAssignmentId(null);
    }
  };
  const hasSearchQuery = searchQuery.trim().length > 0;
  const hasSearchResults = filteredAssignments.length > 0;
  const assignmentListNode = hasSearchResults ? (
    <AssignmentsList
      items={filteredAssignments}
      onDeleteAssignment={handleDeleteAssignment}
      deletingAssignmentId={deletingAssignmentId}
    />
  ) : null;
  const hasActiveFilter = activeFilter !== 'all';
  const noResultsNode = (hasSearchQuery || hasActiveFilter) && !hasSearchResults ? (
    <section className="rounded-[16px] bg-surface-base p-[16px]">
      <p className="font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-secondary">
        No assignments match your search or filter.
      </p>
    </section>
  ) : null;

  const emptyStateNode = (
    <AssignmentsEmptyState
      title="No assignments yet"
      description="Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading."
      actionLabel="Create Your First Assignment"
      onActionClick={() => router.push(APP_ROUTES.createAssignment)}
    />
  );
  const mobileCreateFabNode = (
    <div className="pointer-events-none fixed bottom-[96px] left-[10px] right-[10px] z-50 w-auto">
      <div className="pointer-events-auto flex items-center justify-end">
        <FloatingActionButton
          label="Create assignment"
          icon={<PlusIcon className="h-[20px] w-[20px]" />}
          onClick={() => router.push(APP_ROUTES.createAssignment)}
          testId="assignments-mobile-create-fab"
        />
      </div>
    </div>
  );

  const listStateNode = (
    <div className="mb-[22px] mt-0 grid w-full gap-[12px] xl:mx-[12px] xl:w-[calc(100%-24px)]">
      <section className="grid w-full gap-[16px]">
        <div className="flex h-[66px] w-full items-center gap-[8px]">
          <span className="inline-flex h-[12px] w-[12px] rounded-full border-[4px] border-[#4BC26D66] bg-[#4BC26D]" />
          <div className="grid h-[50px] gap-[2px]">
            <h1 className="font-heading text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">
              Assignments
            </h1>
            <p className="font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-text-secondary">
              Manage and create assignments for your classes.
            </p>
          </div>
        </div>
      </section>
      <AssignmentsFilterBar
        searchPlaceholder="Search Assignment"
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      {assignmentListNode}
      {noResultsNode}
      <div
        className="fixed bottom-0 left-[315px] right-0 z-20 hidden h-[73px] items-center justify-center gap-[10px] overflow-hidden border border-[#FFFFFF8A] py-[10px] shadow-[inset_0_1px_0_#FFFFFFA6,0_-12px_36px_rgba(255,255,255,0.18)] xl:flex max-[1400px]:left-0"
        style={{
          background:
            'linear-gradient(176.12deg, rgba(234, 234, 234, 0) 3.17%, rgba(218, 218, 218, 1) 81.22%)',
        }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            maskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
          }}
        />
        <Link
          href={APP_ROUTES.createAssignment}
          className="relative z-[1] inline-flex h-[46px] w-[208px] items-center justify-center gap-[4px] rounded-[100px] border-[1.5px] border-transparent bg-[#181818] px-[24px] py-[12px] font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-[#FFFFFF] [border-image-source:linear-gradient(180deg,rgba(255,255,255,0.5)_0%,rgba(102,102,102,0)_100%)] transition-all duration-300 ease-out hover:bg-[#101010] hover:shadow-[0_12px_28px_rgba(0,0,0,0.30)] hover:scale-[1.03] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
        >
          <PlusIcon className="h-[20px] w-[20px]" />
          Create Assignment
        </Link>
      </div>
    </div>
  );
  const pageBodyNode = isEmpty ? emptyStateNode : listStateNode;

  return (
    <AppWorkspaceLayout
      title="Assignment"
      subtitle="Manage and create assignments for your classes."
      activeMenuId="assignments"
      menuBadgeCounts={{ assignments: assignmentCount }}
      mobileOverlay={mobileCreateFabNode}
    >
      {pageBodyNode}
    </AppWorkspaceLayout>
  );
};
