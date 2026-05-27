import type { AssignmentListItem } from '@/features/assignments/types/assignment-list-types';
import { AssignmentCard } from '@/shared/components/assignment-card';

type AssignmentsListProps = {
  items: AssignmentListItem[];
  onDeleteAssignment: (assignmentId: string) => void;
  deletingAssignmentId: string | null;
};

export const AssignmentsList = ({ items, onDeleteAssignment, deletingAssignmentId }: AssignmentsListProps) => {
  return (
    <section className="grid w-full grid-cols-2 gap-x-[16px] gap-y-[12px] max-[1200px]:grid-cols-1">
      {items.map((item) => (
        <AssignmentCard
          key={item.id}
          assignmentId={item.id}
          title={item.title}
          assignedDate={item.assignedDate}
          dueDate={item.dueDate}
          onDelete={() => onDeleteAssignment(item.id)}
          isDeleting={deletingAssignmentId === item.id}
        />
      ))}
    </section>
  );
};
