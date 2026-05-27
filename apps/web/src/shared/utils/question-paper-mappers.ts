import type { QuestionPaperViewModel } from '@/features/question-paper/types/question-paper-types';
import type { GeneratedPaperResponse, QuestionType } from '@/types/assessment';

const questionTypeLabelMap: Record<QuestionType, string> = {
  mcq: 'Multiple Choice Questions',
  short_answer: 'Short Answer Questions',
  long_answer: 'Long Answer Questions',
  case_study: 'Case Study Questions',
  true_false: 'True/False Questions',
};

export const mapGeneratedPaperToViewModel = (
  paper: GeneratedPaperResponse,
  assignmentQuestionTypes: QuestionType[] = [],
  metadata?: {
    schoolName?: string;
    subject?: string;
    className?: string;
    durationText?: string;
    maxMarks?: number;
    questionTypeConfig?: Array<{
      questionType: QuestionType;
      questionCount: number;
      marks: number;
    }>;
  }
): QuestionPaperViewModel => {
  const questionTypeConfigMap = new Map(
    (metadata?.questionTypeConfig ?? []).map((config) => [config.questionType, config.marks])
  );

  return {
    schoolName: metadata?.schoolName?.trim() || 'Delhi Public School',
    subject: paper.metadata?.subject?.trim() || metadata?.subject?.trim() || 'General',
    className: paper.metadata?.className?.trim() || metadata?.className?.trim() || 'N/A',
    durationText: paper.metadata?.durationText?.trim() || metadata?.durationText?.trim() || 'N/A',
    maxMarks:
      metadata?.maxMarks ??
      paper.sections.reduce((sum, section) => {
        return sum + section.questions.reduce((sectionSum, question) => sectionSum + question.marks, 0);
      }, 0),
    sections: paper.sections.map((section, sectionIndex) => ({
      id: `${paper._id}-section-${sectionIndex + 1}`,
      title: section.title,
      instruction: section.instruction,
      questionTypeLabel:
        questionTypeLabelMap[assignmentQuestionTypes[sectionIndex] as QuestionType] ?? 'Questions',
      questions: section.questions.map((question, questionIndex) => ({
        id: `${paper._id}-question-${sectionIndex + 1}-${questionIndex + 1}`,
        text: question.text,
        difficulty: question.difficulty,
        marks:
          questionTypeConfigMap.get(assignmentQuestionTypes[sectionIndex] as QuestionType) ??
          question.marks,
      })),
    })),
  };
};
