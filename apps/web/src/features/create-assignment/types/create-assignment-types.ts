import type { QuestionType } from '@/types/assessment';

export type CreateAssignmentStep = 1 | 2;

export type CreateAssignmentFormValues = {
  dueDate: string;
  instructions: string;
  totalQuestions: number;
  totalMarks: number;
};

export type QuestionTypeRow = {
  id: string;
  questionType: QuestionType;
  label: string;
  questionCount: number;
  marks: number;
};
