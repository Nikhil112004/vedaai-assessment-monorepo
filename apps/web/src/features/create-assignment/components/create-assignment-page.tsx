'use client';

import { type ChangeEvent, type FormEvent, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateAssignmentStepper } from '@/features/create-assignment/components/create-assignment-stepper';
import { QuestionTypeBuilder } from '@/features/create-assignment/components/question-type-builder';
import { UploadSourceCard } from '@/features/create-assignment/components/upload-source-card';
import { AppWorkspaceLayout } from '@/features/layout/components/app-workspace-layout';
import type { QuestionTypeRow } from '@/features/create-assignment/types/create-assignment-types';
import { APP_ROUTES } from '@/shared/constants/app-routes';
import {
  CreateAssignmentArrowLeftIcon,
  CreateAssignmentArrowRightIcon,
  CreateAssignmentMicIcon,
} from '@/shared/components/app-icons';
import { DateInput } from '@/shared/components/date-input';
import { PageActionsFooter } from '@/shared/components/page-actions-footer';
import { PrimaryButton } from '@/shared/components/primary-button';
import { SecondaryButton } from '@/shared/components/secondary-button';
import { TextAreaInput } from '@/shared/components/text-area-input';
import type { QuestionType } from '@/types/assessment';
import { createAssignmentThunk, generatePaperThunk, setFormValue } from '@/store/slices/assignmentSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const QUESTION_TYPE_OPTIONS: Array<{ type: QuestionType; label: string }> = [
  { type: 'mcq', label: 'Multiple Choice Questions' },
  { type: 'short_answer', label: 'Short Questions' },
  { type: 'long_answer', label: 'Long Questions' },
  { type: 'case_study', label: 'Case Study Questions' },
  { type: 'true_false', label: 'True/False Questions' },
];

const QUESTION_TYPE_LABEL_MAP: Record<QuestionType, string> = {
  mcq: 'Multiple Choice Questions',
  short_answer: 'Short Questions',
  long_answer: 'Long Questions',
  case_study: 'Case Study Questions',
  true_false: 'True/False Questions',
};

const buildRow = (questionType: QuestionType, index: number): QuestionTypeRow => ({
  id: `${questionType}-${index}`,
  questionType,
  label: QUESTION_TYPE_LABEL_MAP[questionType],
  questionCount: 1,
  marks: 1,
});

const isFutureDate = (value: string): boolean => {
  if (!value) return false;
  const picked = new Date(value);
  if (Number.isNaN(picked.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  picked.setHours(0, 0, 0, 0);
  return picked >= today;
};

export const CreateAssignmentPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const form = useAppSelector((state) => state.assignment.form);
  const assignmentRequestState = useAppSelector((state) => state.assignment.assignmentRequestState);
  const backendErrorMessage = useAppSelector((state) => state.assignment.errorMessage);

  const [rows, setRows] = useState<QuestionTypeRow[]>([buildRow('mcq', 0)]);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedTypes = useMemo(() => rows.map((row) => row.questionType), [rows]);
  const selectedSourceFileName = form.sourceFile?.name;
  const uploadCardTitle = selectedSourceFileName ?? 'Choose a file or drag & drop it here';
  const totalQuestions = useMemo(() => rows.reduce((sum, row) => sum + row.questionCount, 0), [rows]);
  const totalMarks = useMemo(() => rows.reduce((sum, row) => sum + row.questionCount * row.marks, 0), [rows]);
  const isAssignmentRequestLoading = assignmentRequestState === 'loading';
  const primaryActionLabel = isAssignmentRequestLoading ? 'Saving...' : 'Next';
  const errorMessageClassName = 'rounded-[12px] bg-[#FFE7E7] px-[12px] py-[10px] text-[14px] font-medium text-[#B42318]';
  const formErrorNode = formError ? <p className={errorMessageClassName}>{formError}</p> : null;
  const backendErrorNode = backendErrorMessage
    ? <p className={errorMessageClassName}>{backendErrorMessage}</p>
    : null;
  const updateRow = (rowId: string, updater: (row: QuestionTypeRow) => QuestionTypeRow) => {
    setRows((previousRows) => previousRows.map((row) => (row.id === rowId ? updater(row) : row)));
  };

  const handleAddRow = useCallback(() => {
    const nextOption = QUESTION_TYPE_OPTIONS.find((option) => !selectedTypes.includes(option.type));
    if (!nextOption) return;
    setRows((previousRows) => [...previousRows, buildRow(nextOption.type, previousRows.length)]);
  }, [selectedTypes]);

  const handleRemoveRow = useCallback((rowId: string) => {
    setRows((previousRows) => {
      if (previousRows.length === 1) return previousRows;
      return previousRows.filter((row) => row.id !== rowId);
    });
  }, []);

  const handleCycleType = useCallback((rowId: string) => {
    setRows((previousRows) => {
      const rowIndex = previousRows.findIndex((row) => row.id === rowId);
      if (rowIndex === -1) return previousRows;
      const currentRow = previousRows[rowIndex];
      if (!currentRow) return previousRows;

      const currentType = currentRow.questionType;
      const currentTypeIndex = QUESTION_TYPE_OPTIONS.findIndex((option) => option.type === currentType);

      for (let offset = 1; offset <= QUESTION_TYPE_OPTIONS.length; offset += 1) {
        const nextIndex = (currentTypeIndex + offset) % QUESTION_TYPE_OPTIONS.length;
        const nextOption = QUESTION_TYPE_OPTIONS[nextIndex];
        if (!nextOption) continue;
        const nextType = nextOption.type;
        const typeTakenByOtherRow = previousRows.some((row, index) => index !== rowIndex && row.questionType === nextType);
        if (typeTakenByOtherRow) continue;

        const nextRows = [...previousRows];
        const rowToUpdate = nextRows[rowIndex];
        if (!rowToUpdate) return previousRows;
        nextRows[rowIndex] = {
          ...rowToUpdate,
          questionType: nextType,
          label: QUESTION_TYPE_LABEL_MAP[nextType],
        };
        return nextRows;
      }

      return previousRows;
    });
  }, []);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormValue({ key: 'sourceFile', value: event.currentTarget.files?.[0] ?? null }));
  }, [dispatch]);

  const handleDueDateChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormValue({ key: 'dueDate', value: event.target.value }));
  }, [dispatch]);

  const handleInstructionsChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setFormValue({ key: 'instructions', value: event.target.value }));
  }, [dispatch]);

  const handleBackToAssignments = useCallback(() => {
    router.push(APP_ROUTES.assignments);
  }, [router]);

  const handleIncrementQuestionCount = useCallback(
    (rowId: string) => updateRow(rowId, (row) => ({ ...row, questionCount: row.questionCount + 1 })),
    []
  );

  const handleDecrementQuestionCount = useCallback(
    (rowId: string) => updateRow(rowId, (row) => ({ ...row, questionCount: Math.max(1, row.questionCount - 1) })),
    []
  );

  const handleIncrementMarks = useCallback(
    (rowId: string) => updateRow(rowId, (row) => ({ ...row, marks: row.marks + 1 })),
    []
  );

  const handleDecrementMarks = useCallback(
    (rowId: string) => updateRow(rowId, (row) => ({ ...row, marks: Math.max(1, row.marks - 1) })),
    []
  );

  const validateForm = (): string | null => {
    if (!isFutureDate(form.dueDate)) return 'Please select a valid due date (today or later).';
    if (!form.instructions.trim()) return 'Additional instructions are required.';
    if (rows.some((row) => row.questionCount < 1 || row.marks < 1)) return 'Questions and marks must be at least 1.';
    if (totalQuestions < 1 || totalMarks < 1) return 'Total questions and marks must be greater than zero.';
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError(null);
    const createResult = await dispatch(
      createAssignmentThunk({
        dueDate: new Date(form.dueDate).toISOString(),
        questionTypes: selectedTypes,
        questionTypeConfig: rows.map((row) => ({
          questionType: row.questionType,
          questionCount: row.questionCount,
          marks: row.marks,
        })),
        totalQuestions,
        totalMarks,
        instructions: form.instructions.trim(),
        sourceFile: form.sourceFile,
      })
    );

    if (createAssignmentThunk.fulfilled.match(createResult)) {
      const createdAssignmentId = createResult.payload._id;
      await dispatch(generatePaperThunk({ assignmentId: createdAssignmentId, regenerate: false }));
      router.push(APP_ROUTES.questionPaper.replace('[assignmentId]', createdAssignmentId));
    }
  };

  const leftFooterAction = (
    <SecondaryButton type="button" onClick={handleBackToAssignments} leftIcon={<CreateAssignmentArrowLeftIcon />} className="w-[134px]">
      Previous
    </SecondaryButton>
  );
  const rightFooterAction = (
    <PrimaryButton type="submit" rightIcon={<CreateAssignmentArrowRightIcon />} className="w-[106px]" disabled={isAssignmentRequestLoading}>
      {primaryActionLabel}
    </PrimaryButton>
  );

  return (
    <AppWorkspaceLayout title="Assignment" subtitle="Set up a new assignment for your students" activeMenuId="create-assignment">
      <form onSubmit={handleSubmit} className="mx-auto grid min-h-full w-full max-w-[373px] gap-[24px] px-[12px] pb-[180px] lg:max-w-full lg:gap-[32px] lg:px-0 lg:pb-[24px]">
        <section className="grid w-full gap-[24px] lg:gap-[16px]">
          <div className="flex items-center justify-between lg:hidden">
            <button type="button" aria-label="Back to assignments" onClick={handleBackToAssignments} className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-[100px] bg-surface-muted text-text-primary">
              <CreateAssignmentArrowLeftIcon />
            </button>
            <h1 className="font-heading text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">Create Assignment</h1>
            <div className="w-[48px]" aria-hidden />
          </div>

          <div className="hidden h-[66px] w-full items-center gap-[8px] lg:flex">
            <span className="inline-flex h-[12px] w-[12px] rounded-full border-[4px] border-[#4BC26D66] bg-[#4BC26D]" />
            <div className="grid h-[50px] gap-[2px]">
              <h1 className="font-heading text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">Create Assignment</h1>
              <p className="font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-text-secondary">Set up a new assignment for your students</p>
            </div>
          </div>

          <CreateAssignmentStepper currentStep={1} totalSteps={2} />
        </section>

        <section className="mx-auto grid w-[349px] gap-[24px] rounded-[32px] bg-[#FFFFFF80] px-[16px] pb-[32px] pt-[32px] lg:w-[1103px] lg:gap-[32px] lg:p-[32px]">
          <div className="grid gap-[2px]">
            <h2 className="h-[28px] w-[176px] font-heading text-[20px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">Assignment Details</h2>
            <p className="h-[20px] w-[251px] font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-text-secondary">Basic information about your assignment</p>
          </div>

          <UploadSourceCard
            title={uploadCardTitle}
            hint="PDF, TXT up to 10MB"
            supportText="Upload source material for context (optional)"
            isSelected={Boolean(selectedSourceFileName)}
            accept=".pdf,.txt"
            onFileChange={handleFileChange}
          />

          <div className="grid w-full gap-[24px] lg:h-[74px]">
            <label htmlFor="assignment-due-date-input" className="font-heading text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">Due Date</label>
            <DateInput
              id="assignment-due-date-input"
              testId="assignment-due-date-input"
              inputType="date"
              showCalendarButton={false}
              value={form.dueDate}
              onChange={handleDueDateChange}
              placeholder="DD-MM-YYYY"
            />
          </div>

          <QuestionTypeBuilder
            rows={rows}
            selectedTypes={selectedTypes}
            questionTypeLabelMap={QUESTION_TYPE_LABEL_MAP}
            onAddRow={handleAddRow}
            onRemoveRow={handleRemoveRow}
            onCycleType={handleCycleType}
            onIncrementQuestionCount={handleIncrementQuestionCount}
            onDecrementQuestionCount={handleDecrementQuestionCount}
            onIncrementMarks={handleIncrementMarks}
            onDecrementMarks={handleDecrementMarks}
          />

          <section className="grid w-full gap-[8px]">
            <h3
              id="assignment-additional-info-label"
              className="font-heading text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary"
            >
              Additional Information (For better output)
            </h3>
            <TextAreaInput
              id="assignment-additional-info-input"
              aria-labelledby="assignment-additional-info-label"
              required
              value={form.instructions}
              onChange={handleInstructionsChange}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
              testId="assignment-additional-info"
              textAreaClassName="h-[102px] rounded-[16px] border-[1.25px] border-dashed border-[#DADADA] p-[16px]"
              trailingAction={(
                <button
                  type="button"
                  aria-label="Voice input"
                  className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-[18px] bg-[#F0F0F0] px-[0.82px] shadow-[0_21.82px_32.73px_0_#00000033,0_10.91px_32.73px_0_#0000001F]"
                >
                  <CreateAssignmentMicIcon />
                </button>
              )}
            />
          </section>

          {formErrorNode}
          {backendErrorNode}
        </section>

        <PageActionsFooter
          className="mx-auto lg:w-[1103px]"
          leftAction={leftFooterAction}
          rightAction={rightFooterAction}
        />
      </form>
    </AppWorkspaceLayout>
  );
};
