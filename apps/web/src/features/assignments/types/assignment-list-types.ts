export type AssignmentListItem = {
  id: string;
  title: string;
  assignedDate: string;
  dueDate: string;
  assignedDateIso: string;
  dueDateIso: string;
  searchableText?: string;
};

export type AssignmentListViewState = 'loading' | 'empty' | 'ready';

export type AssignmentFilter = 'all' | 'due_today' | 'due_this_week' | 'overdue' | 'assigned_this_week';
