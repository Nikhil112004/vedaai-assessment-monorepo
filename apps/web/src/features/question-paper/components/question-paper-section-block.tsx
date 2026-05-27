import type { QuestionPaperSection } from '@/features/question-paper/types/question-paper-types';

type QuestionPaperSectionBlockProps = {
  section: QuestionPaperSection;
};

export const QuestionPaperSectionBlock = ({ section }: QuestionPaperSectionBlockProps) => {
  const getDifficultyLabel = (difficulty: string): string => {
    if (difficulty === 'medium') return 'Moderate';
    if (difficulty === 'hard') return 'Hard';
    return 'Easy';
  };

  return (
    <section className="grid w-full gap-[16px]">
      <h3 className="h-auto text-center font-button text-[20px] font-semibold leading-[160%] tracking-[-0.04em] text-text-primary sm:h-[38px] sm:text-[24px]">
        {section.title}
      </h3>
      <div className="grid gap-[0px]">
        <h4 className="font-button text-[18px] font-bold leading-[200%] tracking-[-0.04em] text-text-primary sm:text-[20px] sm:leading-[240%]">
          {section.questionTypeLabel}
        </h4>
        <p className="font-button text-[16px] italic font-normal leading-[160%] tracking-[-0.04em] text-text-secondary">
          {section.instruction}
        </p>
      </div>
      <ol className="grid gap-[4px]">
        {section.questions.map((question, index) => (
          <li key={question.id} className="break-words font-button text-[15px] font-normal leading-[200%] tracking-[-0.04em] text-text-primary sm:text-[16px] sm:leading-[240%]">
            <span>{`${index + 1}. `}</span>
            <span className="font-bold">{`[${getDifficultyLabel(question.difficulty)}] `}</span>
            <span>{question.text}</span>
            <span className="font-bold">{` [${question.marks} Marks]`}</span>
          </li>
        ))}
      </ol>
    </section>
  );
};
