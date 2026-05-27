import { StudentInfoBlock } from '@/features/question-paper/components/student-info-block';
import { QuestionPaperSectionBlock } from '@/features/question-paper/components/question-paper-section-block';
import type { QuestionPaperViewModel } from '@/features/question-paper/types/question-paper-types';

type QuestionPaperViewProps = {
  data: QuestionPaperViewModel;
};

export const QuestionPaperView = ({ data }: QuestionPaperViewProps) => {
  return (
    <article className="grid h-auto w-full gap-[16px] rounded-[24px] border-t-[4px] border-surface-muted bg-surface-base px-[16px] py-[20px] sm:gap-[24px] sm:rounded-[32px] sm:px-[32px] sm:py-[32px]">
      <header className="mx-auto grid h-auto w-full max-w-[996px] text-center">
        <h2 className="font-button text-[24px] font-bold leading-[140%] tracking-[-0.04em] text-text-primary sm:text-[32px] sm:leading-[160%]">{data.schoolName}</h2>
        <p className="font-button text-[18px] font-semibold leading-[140%] tracking-[-0.04em] text-text-primary sm:text-[24px] sm:leading-[160%]">{`Subject: ${data.subject}`}</p>
        <p className="font-button text-[18px] font-semibold leading-[140%] tracking-[-0.04em] text-text-primary sm:text-[24px] sm:leading-[160%]">{`Class: ${data.className}`}</p>
      </header>
      <div className="flex w-full flex-col items-start gap-[4px] sm:h-[29px] sm:flex-row sm:items-center sm:justify-between sm:gap-[0px]">
        <span className="w-full text-left font-button text-[16px] font-semibold leading-[160%] tracking-[-0.04em] text-text-primary sm:h-[29px] sm:w-[209px] sm:text-[18px]">{`Time Allowed: ${data.durationText}`}</span>
        <span className="w-full text-left font-button text-[16px] font-semibold leading-[160%] tracking-[-0.04em] text-text-primary sm:ml-auto sm:h-[29px] sm:w-[241px] sm:text-right sm:text-[18px]">{`Maximum Marks: ${data.maxMarks}`}</span>
      </div>
      <p className="w-full font-button text-[16px] font-semibold leading-[160%] tracking-[-0.04em] text-text-primary sm:h-[29px] sm:text-[18px]">
        All questions are compulsory unless stated otherwise.
      </p>
      <div className="w-full">
        <StudentInfoBlock classNameText={data.className} />
      </div>
      <section className="grid w-full gap-[0px]">
        {data.sections.map((section) => (
          <QuestionPaperSectionBlock key={section.id} section={section} />
        ))}
        <p className="w-full font-button text-[20px] font-bold leading-[240%] tracking-[-0.04em] text-text-primary">
          End of Question Paper
        </p>
      </section>
    </article>
  );
};
