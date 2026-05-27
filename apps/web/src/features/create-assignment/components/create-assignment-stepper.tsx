import { StepperProgress } from '@/shared/components/stepper-progress';

type CreateAssignmentStepperProps = {
  currentStep: number;
  totalSteps: number;
};

export const CreateAssignmentStepper = ({ currentStep, totalSteps }: CreateAssignmentStepperProps) => {
  return (
    <div className="w-full max-w-[349px] lg:mx-auto lg:max-w-[1103px]">
      <StepperProgress currentStep={currentStep} totalSteps={totalSteps} className="gap-[12px] lg:gap-[10px]" segmentClassName="rounded-full border-[5px]" />
    </div>
  );
};
