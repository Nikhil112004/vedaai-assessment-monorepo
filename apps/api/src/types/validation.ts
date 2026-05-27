import { z } from 'zod';
import { assignmentQuestionTypes } from '../models';

export const createAssignmentSchema = z
  .object({
    dueDate: z.iso.datetime(),
    questionTypes: z.array(z.enum(assignmentQuestionTypes)).min(1),
    questionTypeConfig: z
      .array(
        z.object({
          questionType: z.enum(assignmentQuestionTypes),
          questionCount: z.number().int().min(1),
          marks: z.number().int().min(1),
        })
      )
      .optional(),
    totalQuestions: z.number().int().min(1),
    totalMarks: z.number().int().min(1),
    instructions: z.string().trim().min(3),
    sourceText: z.string().trim().min(3).optional().nullable(),
    createdBy: z.string().trim().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    const dueDate = new Date(value.dueDate);
    const dueDateDayUtc = Date.UTC(
      dueDate.getUTCFullYear(),
      dueDate.getUTCMonth(),
      dueDate.getUTCDate()
    );
    const now = new Date();
    const todayDayUtc = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );

    if (dueDateDayUtc < todayDayUtc) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['dueDate'],
        message: 'Due date must be today or a future date.',
      });
    }

    if (!value.questionTypeConfig?.length) return;

    const configTypeSet = new Set(value.questionTypeConfig.map((entry) => entry.questionType));
    const selectedTypeSet = new Set(value.questionTypes);

    for (const config of value.questionTypeConfig) {
      if (!selectedTypeSet.has(config.questionType)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['questionTypeConfig'],
          message: `Unexpected question type config for ${config.questionType}.`,
        });
      }
    }

    if (configTypeSet.size !== value.questionTypeConfig.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['questionTypeConfig'],
        message: 'Duplicate question type config entries are not allowed.',
      });
    }

    const totalQuestionsFromConfig = value.questionTypeConfig.reduce((sum, entry) => sum + entry.questionCount, 0);
    const totalMarksFromConfig = value.questionTypeConfig.reduce(
      (sum, entry) => sum + entry.questionCount * entry.marks,
      0
    );

    if (totalQuestionsFromConfig !== value.totalQuestions) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['totalQuestions'],
        message: 'Total questions must match question type configuration.',
      });
    }

    if (totalMarksFromConfig !== value.totalMarks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['totalMarks'],
        message: 'Total marks must match question type configuration.',
      });
    }
  });

export const generatePaperSchema = z.object({
  regenerate: z.boolean().optional().default(false),
});
