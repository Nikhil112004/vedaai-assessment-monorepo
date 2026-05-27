export const assignmentStatuses = [
  'draft',
  'queued',
  'processing',
  'completed',
  'failed',
] as const;

export const assignmentQuestionTypes = [
  'mcq',
  'short_answer',
  'long_answer',
  'case_study',
  'true_false',
] as const;

export const questionDifficulties = ['easy', 'medium', 'hard'] as const;
