type StepperProgressProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
  segmentClassName?: string;
};

export const StepperProgress = ({
  currentStep,
  totalSteps,
  className,
  segmentClassName,
}: StepperProgressProps) => {
  const safeTotalSteps = totalSteps > 0 ? totalSteps : 1;
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), safeTotalSteps);

  return (
    <div
      className={[
        'flex w-full items-center gap-[10px]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Step ${safeCurrentStep} of ${safeTotalSteps}`}
    >
      {Array.from({ length: safeTotalSteps }).map((_, index) => {
        const isActive = index < safeCurrentStep;
        return (
          <div
            key={`step-segment-${index + 1}`}
            className={[
              'h-0 flex-1 border-[5px]',
              isActive ? 'border-[#5E5E5E]' : 'border-[#DADADA]',
              segmentClassName,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden
          />
        );
      })}
    </div>
  );
};

