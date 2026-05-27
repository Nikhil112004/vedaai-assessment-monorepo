import { AssignmentsPage } from '@/features/assignments/components/assignments-page';
import type { AssignmentListItem } from '@/features/assignments/types/assignment-list-types';
import { assignmentApi } from '@/lib/api/assignment-api';
import type { QuestionType } from '@/types/assessment';
import { formatUiDate } from '@/shared/utils/date-formatters';

const questionTypeLabels: Record<QuestionType, string> = {
  mcq: 'MCQ',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
  case_study: 'Case Study',
  true_false: 'True/False',
};

export const dynamic = 'force-dynamic';

const buildAssignmentTitle = (questionTypes: QuestionType[], totalQuestions: number): string => {
  const primaryType = questionTypes[0];
  if (!primaryType) return `Assignment (${totalQuestions} Questions)`;
  return `${questionTypeLabels[primaryType]} Assignment`;
};

export default async function AssignmentsRoute() {
  try {
    const assignments = await assignmentApi.listAssignments();
    const items: AssignmentListItem[] = assignments.map((assignment) => ({
      id: assignment._id,
      title: buildAssignmentTitle(assignment.questionTypes, assignment.totalQuestions),
      assignedDate: formatUiDate(assignment.createdAt ?? assignment.dueDate),
      dueDate: formatUiDate(assignment.dueDate),
      assignedDateIso: assignment.createdAt ?? assignment.dueDate,
      dueDateIso: assignment.dueDate,
      searchableText: [
        buildAssignmentTitle(assignment.questionTypes, assignment.totalQuestions),
        assignment.instructions,
        assignment.questionTypes.join(' '),
      ]
        .filter(Boolean)
        .join(' '),
    }));

    return <AssignmentsPage items={items} />;
  } catch {
    return <AssignmentsPage items={[]} />;
  }
}
