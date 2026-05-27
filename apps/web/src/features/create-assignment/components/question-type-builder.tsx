'use client';

import type { QuestionType } from '@/types/assessment';
import type { QuestionTypeRow } from '@/features/create-assignment/types/create-assignment-types';
import { CounterInput } from '@/shared/components/counter-input';
import { QuestionTypeSelect } from '@/shared/components/question-type-select';
import { ChevronDownIcon, CloseIcon } from '@/shared/components/app-icons';

type QuestionTypeBuilderProps = {
  rows: QuestionTypeRow[];
  selectedTypes: QuestionType[];
  questionTypeLabelMap: Record<QuestionType, string>;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
  onCycleType: (rowId: string) => void;
  onIncrementQuestionCount: (rowId: string) => void;
  onDecrementQuestionCount: (rowId: string) => void;
  onIncrementMarks: (rowId: string) => void;
  onDecrementMarks: (rowId: string) => void;
};

export const QuestionTypeBuilder = ({
  rows,
  selectedTypes,
  questionTypeLabelMap,
  onAddRow,
  onRemoveRow,
  onCycleType,
  onIncrementQuestionCount,
  onDecrementQuestionCount,
  onIncrementMarks,
  onDecrementMarks,
}: QuestionTypeBuilderProps) => {
  const totalQuestions = rows.reduce((sum, row) => sum + row.questionCount, 0);
  const totalMarks = rows.reduce((sum, row) => sum + row.questionCount * row.marks, 0);

  return (
    <section className="grid w-full gap-[16px]">
      <div className="grid grid-cols-1 gap-[8px] lg:grid-cols-[minmax(0,1fr)_120px_120px] lg:items-start lg:gap-[24px]">
        <div className="grid gap-[16px]">
          <h3 className="h-[22px] font-heading text-[16px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">Question Type</h3>
          <div className="grid gap-[16px]">
            {rows.map((row) => (
              <QuestionTypeSelect
                key={row.id}
                value={row.label}
                className="md:bg-transparent"
                onSelectClick={() => onCycleType(row.id)}
                onRemoveClick={() => onRemoveRow(row.id)}
                showRemove={rows.length > 1}
              />
            ))}
          </div>
        </div>
        <div className="hidden lg:grid lg:gap-[16px]">
          <p className="h-[22px] text-center font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary">No. of Questions</p>
          {rows.map((row) => (
            <CounterInput
              key={`${row.id}-count`}
              value={row.questionCount}
              label={`${row.label} questions`}
              onIncrement={() => onIncrementQuestionCount(row.id)}
              onDecrement={() => onDecrementQuestionCount(row.id)}
              min={1}
              className="w-full"
            />
          ))}
        </div>
        <div className="hidden lg:grid lg:gap-[16px]">
          <p className="h-[22px] text-center font-heading text-[16px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary">Marks</p>
          {rows.map((row) => (
            <CounterInput
              key={`${row.id}-marks`}
              value={row.marks}
              label={`${row.label} marks`}
              onIncrement={() => onIncrementMarks(row.id)}
              onDecrement={() => onDecrementMarks(row.id)}
              min={1}
              className="w-full"
            />
          ))}
        </div>
      </div>

      <div className="grid gap-[12px] lg:hidden">
        {rows.map((row) => {
          const mobileRemoveButtonNode = rows.length > 1 ? (
            <button
              type="button"
              aria-label="Remove question type"
              onClick={() => onRemoveRow(row.id)}
              className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-[100px] text-text-primary transition-all duration-300 ease-out hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
            >
              <CloseIcon />
            </button>
          ) : null;

          return (
            <article key={`mobile-${row.id}`} className="rounded-[32px] bg-surface-base p-[12px]">
              <div className="grid gap-[12px]">
                <div className="flex h-[32px] items-center gap-[8px]">
                  <button
                    type="button"
                    aria-label="Select question type"
                    onClick={() => onCycleType(row.id)}
                    className="inline-flex h-[32px] min-w-0 flex-1 items-center justify-between rounded-[100px] px-[4px] font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong"
                  >
                    <span className="truncate text-left">{row.label}</span>
                    <span aria-hidden className="inline-flex h-[16px] w-[16px] items-center justify-center">
                      <ChevronDownIcon />
                    </span>
                  </button>
                  {mobileRemoveButtonNode}
                </div>

                <div className="mx-auto grid min-h-[82px] w-full max-w-[293px] gap-[12px] rounded-[24px] bg-[#F0F0F0] p-[8px]">
                  <div className="grid grid-cols-2 gap-[12px]">
                    <p className="text-center font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary">No. of Questions</p>
                    <p className="text-center font-heading text-[14px] font-medium leading-[140%] tracking-[-0.04em] text-text-primary">Marks</p>
                  </div>

                  <div className="grid grid-cols-2 gap-[12px]">
                    <CounterInput
                      value={row.questionCount}
                      label={`${row.label} questions`}
                      onIncrement={() => onIncrementQuestionCount(row.id)}
                      onDecrement={() => onDecrementQuestionCount(row.id)}
                      min={1}
                      className="h-[42px] w-full"
                    />
                    <CounterInput
                      value={row.marks}
                      label={`${row.label} marks`}
                      onIncrement={() => onIncrementMarks(row.id)}
                      onDecrement={() => onDecrementMarks(row.id)}
                      min={1}
                      className="h-[42px] w-full"
                    />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-[16px] inline-flex h-[36px] w-fit items-center gap-[8px] text-[14px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary">
        <button
          type="button"
          aria-label="Add question type"
          onClick={onAddRow}
          disabled={selectedTypes.length === Object.keys(questionTypeLabelMap).length}
          className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#2B2B2B] text-[28px] font-light leading-none text-text-inverse transition-all duration-300 ease-out hover:bg-[#1F1F1F] hover:shadow-[0_10px_24px_rgba(0,0,0,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          +
        </button>
        <span>Add Question Type</span>
      </div>

      <div className="mt-[16px] grid justify-self-end gap-[8px] text-right lg:w-[150px]">
        <p className="font-heading text-[16px] font-medium leading-[110%] tracking-[-0.04em] text-text-primary">{`Total Questions : ${totalQuestions}`}</p>
        <p className="font-heading text-[16px] font-medium leading-[110%] tracking-[-0.04em] text-text-primary">{`Total Marks : ${totalMarks}`}</p>
      </div>
    </section>
  );
};
