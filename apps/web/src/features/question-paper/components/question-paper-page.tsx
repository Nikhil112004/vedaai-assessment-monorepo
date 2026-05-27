'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QuestionPaperView } from '@/features/question-paper/components/question-paper-view';
import { AppWorkspaceLayout } from '@/features/layout/components/app-workspace-layout';
import { useAssignmentStatusSocket } from '@/hooks/use-assignment-status-socket';
import { assignmentApi } from '@/lib/api/assignment-api';
import { DownloadIcon, RegenerateIcon } from '@/shared/components/app-icons';
import { PillLinkButton } from '@/shared/components/pill-link-button';
import { mapGeneratedPaperToViewModel } from '@/shared/utils/question-paper-mappers';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchGeneratedPaperThunk,
  fetchGenerationStatusThunk,
  generatePaperThunk,
  setCurrentAssignmentId,
} from '@/store/slices/assignmentSlice';
import type { QuestionType } from '@/types/assessment';
import type { AssignmentResponse } from '@/types/assessment';

type QuestionPaperPageProps = {
  assignmentId: string;
};

const objectIdPattern = /^[a-fA-F0-9]{24}$/;

const statusLabelMap = {
  draft: 'Draft',
  queued: 'Queued',
  processing: 'Generating',
  completed: 'Completed',
  failed: 'Failed',
} as const;

const pdfStatusLabelMap = {
  queued: 'PDF queued',
  processing: 'Preparing PDF',
  completed: 'PDF ready',
  failed: 'PDF failed',
} as const;

export const QuestionPaperPage = ({ assignmentId }: QuestionPaperPageProps) => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((store) => store.assignment);
  const [assignmentQuestionTypes, setAssignmentQuestionTypes] = useState<QuestionType[]>([]);
  const [assignmentDetails, setAssignmentDetails] = useState<AssignmentResponse | null>(null);
  const didAutoGenerateRef = useRef(false);
  const isValidAssignmentId = objectIdPattern.test(assignmentId);
  useAssignmentStatusSocket();

  useEffect(() => {
    if (!isValidAssignmentId) return;
    didAutoGenerateRef.current = false;
    dispatch(setCurrentAssignmentId(assignmentId));
  }, [assignmentId, dispatch, isValidAssignmentId]);

  useEffect(() => {
    if (!isValidAssignmentId) return;
    void dispatch(fetchGenerationStatusThunk(assignmentId));
  }, [assignmentId, dispatch, isValidAssignmentId]);

  useEffect(() => {
    if (!isValidAssignmentId) return;

    const loadAssignment = async () => {
      try {
        const assignment = await assignmentApi.getAssignmentById(assignmentId);
        setAssignmentQuestionTypes(assignment.questionTypes);
        setAssignmentDetails(assignment);
      } catch {
        // No-op: page state already handles missing assignment details gracefully.
      }
    };

    void loadAssignment();
  }, [assignmentId, isValidAssignmentId]);

  const assignmentContext = useMemo(
    () => [assignmentDetails?.instructions, assignmentDetails?.sourceText].filter(Boolean).join('\n'),
    [assignmentDetails?.instructions, assignmentDetails?.sourceText]
  );

  const derivedMetadata = useMemo(() => {
    const subject =
      state.generatedPaper?.metadata?.subject ||
      assignmentContext.match(/subject\s*:\s*([^\n,.]+)/i)?.[1]?.trim() ||
      'General';

    const className =
      state.generatedPaper?.metadata?.className ||
      assignmentContext.match(/class\s*:\s*([^\n,.]+)/i)?.[1]?.trim() ||
      assignmentContext.match(/grade\s*:\s*([^\n,.]+)/i)?.[1]?.trim() ||
      'N/A';

    const durationText =
      state.generatedPaper?.metadata?.durationText ||
      assignmentContext.match(/(time allowed|duration|exam duration)\s*:\s*([^\n,.]+)/i)?.[2]?.trim() ||
      'N/A';

    return {
      subject,
      className,
      durationText,
    };
  }, [
    assignmentContext,
    state.generatedPaper?.metadata?.subject,
    state.generatedPaper?.metadata?.className,
    state.generatedPaper?.metadata?.durationText,
  ]);

  const derivedSubject = derivedMetadata.subject;
  const derivedClassName = derivedMetadata.className;
  const derivedDuration = derivedMetadata.durationText;

  const derivedSchoolName = useMemo(() => {
    const instructions = assignmentDetails?.instructions ?? '';
    const schoolMatch = instructions.match(/(school|institute|college)\s*:\s*([^\n,.]+)/i);
    if (schoolMatch?.[2]) {
      return schoolMatch[2].trim();
    }
    return 'Delhi Public School';
  }, [assignmentDetails?.instructions]);

  useEffect(() => {
    if (!isValidAssignmentId) return;
    if (state.assignmentStatus !== 'completed') return;
    void dispatch(fetchGeneratedPaperThunk(assignmentId));
  }, [assignmentId, dispatch, isValidAssignmentId, state.assignmentStatus]);

  useEffect(() => {
    if (!isValidAssignmentId) return;
    if (didAutoGenerateRef.current) return;
    if (state.assignmentStatus === null) return;
    if (state.assignmentStatus === 'queued' || state.assignmentStatus === 'processing' || state.assignmentStatus === 'completed') return;

    didAutoGenerateRef.current = true;
    void dispatch(generatePaperThunk({ assignmentId, regenerate: false }));
  }, [assignmentId, dispatch, isValidAssignmentId, state.assignmentStatus]);

  const canDownloadPdf =
    state.pdfStatus === 'completed' || state.generatedPaper?.pdf?.status === 'completed';
  const generationStatusLabel = state.assignmentStatus
    ? statusLabelMap[state.assignmentStatus]
    : 'Checking status';
  const pdfStatusLabel = state.pdfStatus ? pdfStatusLabelMap[state.pdfStatus] : 'PDF pending';
  const isGenerationInProgress =
    state.assignmentStatus === 'queued' || state.assignmentStatus === 'processing';
  const isGenerationRequestLoading = state.generationRequestState === 'loading';
  const canRegenerate = isValidAssignmentId && !isGenerationInProgress && !isGenerationRequestLoading;
  const liveStatusText = isGenerationInProgress
    ? 'Live update active. We will open the paper as soon as generation finishes.'
    : state.assignmentStatus === 'completed'
      ? 'Question paper generated successfully.'
      : state.assignmentStatus === 'failed'
        ? 'Generation failed. Please try again.'
        : 'Waiting for generation status.';
  const downloadButtonLabel = canDownloadPdf
    ? 'Download as PDF'
    : state.pdfStatus === 'processing' || state.pdfStatus === 'queued'
      ? 'Preparing PDF'
      : 'Download as PDF';
  const regenerateButtonLabel = isGenerationRequestLoading ? 'Starting...' : 'Regenerate';
  const statusPillClassName = 'inline-flex items-center rounded-[100px] px-[16px] font-heading font-medium leading-[140%] tracking-[-0.04em]';
  const inverseOverlayBgClassName = 'bg-[color:color-mix(in_srgb,var(--color-text-inverse)_8%,transparent)]';
  const mobileActionIconButtonClassName =
    'inline-flex h-[40px] w-[40px] items-center justify-center rounded-[100px] border border-[color:color-mix(in_srgb,var(--color-text-inverse)_20%,transparent)] bg-surface-base text-text-primary transition-all duration-300 ease-out hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse disabled:cursor-not-allowed disabled:opacity-60';

  const handleRegenerateClick = useCallback(() => {
    if (!canRegenerate) return;
    void dispatch(generatePaperThunk({ assignmentId, regenerate: true }));
  }, [assignmentId, canRegenerate, dispatch]);

  const viewData = useMemo(
    () =>
      state.generatedPaper
        ? mapGeneratedPaperToViewModel(state.generatedPaper, assignmentQuestionTypes, {
            schoolName: derivedSchoolName,
            subject: derivedSubject,
            className: derivedClassName,
            durationText: derivedDuration,
            maxMarks: assignmentDetails?.totalMarks,
            questionTypeConfig: assignmentDetails?.questionTypeConfig,
          })
        : null,
    [
      state.generatedPaper,
      assignmentQuestionTypes,
      derivedSchoolName,
      derivedSubject,
      derivedClassName,
      derivedDuration,
      assignmentDetails?.totalMarks,
      assignmentDetails?.questionTypeConfig,
    ]
  );

  const headingText = useMemo(() => {
    const contextParts = [derivedClassName !== 'N/A' ? derivedClassName : null, derivedSubject !== 'General' ? derivedSubject : null]
      .filter((entry): entry is string => Boolean(entry));

    const contextLabel = contextParts.length > 0 ? contextParts.join(' - ') : 'your assignment';
    const totalQuestions =
      state.generatedPaper?.sections.reduce((sum, section) => sum + section.questions.length, 0) ??
      assignmentDetails?.totalQuestions ??
      0;

    return totalQuestions > 0
      ? `Your generated question paper for ${contextLabel} with ${totalQuestions} questions is ready.`
      : `Your generated question paper for ${contextLabel} is ready.`;
  }, [assignmentDetails?.totalQuestions, derivedClassName, derivedSubject, state.generatedPaper?.sections]);

  const invalidAssignmentNode = isValidAssignmentId ? null : (
    <section className="rounded-[24px] bg-surface-base p-card-padding">
      <p className="text-body-md text-text-danger">Invalid assignment link. Please create a new assignment and try again.</p>
    </section>
  );

  const errorMessageNode = state.errorMessage ? (
    <p className="rounded-[8px] bg-surface-base px-[12px] py-[8px] text-body-sm text-text-danger">{state.errorMessage}</p>
  ) : null;
  const statusActionsDesktopNode = (
    <div className="hidden flex-wrap items-center gap-[12px] sm:flex">
      <div className={`${statusPillClassName} h-[44px] gap-[8px] text-[14px] ${inverseOverlayBgClassName} text-text-inverse`}>
        <span className="h-[8px] w-[8px] rounded-full bg-status-success" aria-hidden />
        {generationStatusLabel}
      </div>
      <div className={`${statusPillClassName} h-[44px] text-[14px] ${inverseOverlayBgClassName} text-[color:color-mix(in_srgb,var(--color-text-inverse)_80%,transparent)]`}>
        {pdfStatusLabel}
      </div>
      <PillLinkButton
        href={assignmentApi.getGeneratedPaperPdfUrl(assignmentId)}
        target="_blank"
        rel="noreferrer"
        aria-label="Download generated question paper PDF"
        disabled={!canDownloadPdf}
        className="w-[200px] bg-surface-base text-text-primary focus-visible:ring-text-inverse"
        leftIcon={<DownloadIcon className="h-[20px] w-[20px]" />}
      >
        {downloadButtonLabel}
      </PillLinkButton>
      <button
        type="button"
        aria-label="Regenerate question paper"
        onClick={handleRegenerateClick}
        disabled={!canRegenerate}
        data-test-id="question-paper-regenerate-button"
        className="inline-flex h-[44px] min-w-[136px] items-center justify-center rounded-[100px] border border-[color:color-mix(in_srgb,var(--color-text-inverse)_20%,transparent)] bg-[color:color-mix(in_srgb,var(--color-text-inverse)_8%,transparent)] px-[16px] font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-inverse transition-all duration-300 ease-out hover:bg-[color:color-mix(in_srgb,var(--color-text-inverse)_12%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse disabled:cursor-not-allowed disabled:opacity-60"
      >
        {regenerateButtonLabel}
      </button>
    </div>
  );
  const statusActionsMobileNode = (
    <div className="grid gap-[12px] sm:hidden">
      <div className="flex items-center gap-[8px]">
        <div className={`${statusPillClassName} h-[32px] ${inverseOverlayBgClassName} px-[12px] text-[12px] text-text-inverse`}>
          <span className="mr-[6px] h-[6px] w-[6px] rounded-full bg-status-success" aria-hidden />
          {generationStatusLabel}
        </div>
        <div className={`${statusPillClassName} h-[32px] ${inverseOverlayBgClassName} px-[12px] text-[12px] text-[color:color-mix(in_srgb,var(--color-text-inverse)_80%,transparent)]`}>
          {pdfStatusLabel}
        </div>
      </div>
      <div className="flex items-center gap-[8px]">
        <PillLinkButton
          href={assignmentApi.getGeneratedPaperPdfUrl(assignmentId)}
          target="_blank"
          rel="noreferrer"
          aria-label="Download generated question paper PDF"
          disabled={!canDownloadPdf}
          className={`${mobileActionIconButtonClassName} !h-[40px] !w-[40px] !gap-[0px] !px-[0px] !py-[0px]`}
        >
          <span className="sr-only">{downloadButtonLabel}</span>
          <DownloadIcon className="h-[16px] w-[16px]" />
        </PillLinkButton>
        <button
          type="button"
          aria-label="Regenerate question paper"
          onClick={handleRegenerateClick}
          disabled={!canRegenerate}
          data-test-id="question-paper-regenerate-icon-button"
          className={mobileActionIconButtonClassName}
        >
          <RegenerateIcon className="h-[16px] w-[16px]" />
        </button>
      </div>
    </div>
  );

  const showLoadingState =
    state.paperRequestState === 'loading' || state.assignmentStatus === 'queued' || state.assignmentStatus === 'processing';
  const showFailedState = state.assignmentStatus === 'failed';
  const showEmptyState = !viewData;

  let paperContentNode = <QuestionPaperView data={viewData as NonNullable<typeof viewData>} />;
  if (showLoadingState) {
    paperContentNode = (
      <section className="rounded-[24px] bg-surface-base p-card-padding">
        <p className="text-body-md text-text-secondary">Generating question paper, please wait...</p>
      </section>
    );
  } else if (showFailedState) {
    paperContentNode = (
      <section className="rounded-[24px] bg-surface-base p-card-padding">
        <p className="text-body-md text-text-danger">Generation failed. Please try again.</p>
      </section>
    );
  } else if (showEmptyState) {
    paperContentNode = (
      <section className="rounded-[24px] bg-surface-base p-card-padding">
        <p className="text-body-md text-text-secondary">No generated paper found yet.</p>
      </section>
    );
  }

  useEffect(() => {
    if (!isValidAssignmentId) return;
    if (state.assignmentStatus !== 'queued' && state.assignmentStatus !== 'processing') return;

    const interval = setInterval(() => {
      void dispatch(fetchGenerationStatusThunk(assignmentId));
    }, 2500);

    return () => clearInterval(interval);
  }, [assignmentId, dispatch, isValidAssignmentId, state.assignmentStatus]);

  useEffect(() => {
    if (!isValidAssignmentId) return;
    if (state.pdfStatus !== 'completed') return;
    if (state.generatedPaper?.pdf?.status === 'completed') return;

    void dispatch(fetchGeneratedPaperThunk(assignmentId));
  }, [assignmentId, dispatch, isValidAssignmentId, state.generatedPaper?.pdf?.status, state.pdfStatus]);

  return (
    <AppWorkspaceLayout title="Create New" subtitle={`Assignment ID: ${assignmentId}`} activeMenuId="assignments">
      <div className="grid gap-md">
        <section className="mx-0 grid h-auto w-full content-start gap-[12px] rounded-[24px] bg-text-secondary p-[16px] sm:rounded-[32px] sm:p-[20px] xl:mx-[12px]">
          {invalidAssignmentNode}
          <section className="grid min-h-[147px] w-full gap-[12px] rounded-[32px] border-t-[4px] border-surface-muted bg-[color:color-mix(in_srgb,var(--color-brand-secondary)_80%,transparent)] px-[16px] pb-[24px] pt-[24px] text-text-inverse sm:min-h-[164px] sm:gap-[24px] sm:px-[32px]">
            <div className="grid w-full max-w-[996px] gap-[12px] sm:gap-[16px]">
              <h1 className="w-full max-w-[996px] align-middle font-heading text-[14px] font-bold leading-[100%] tracking-[-0.04em] text-surface-page xl:text-[20px] xl:leading-[140%]">
                {headingText}
              </h1>
              {statusActionsDesktopNode}
              {statusActionsMobileNode}
              <p className="font-heading text-[14px] font-normal leading-[140%] tracking-[-0.04em] text-[color:color-mix(in_srgb,var(--color-text-inverse)_70%,transparent)]">
                {liveStatusText}
              </p>
            </div>
            {errorMessageNode}
          </section>

          {paperContentNode}
        </section>
      </div>
    </AppWorkspaceLayout>
  );
};
