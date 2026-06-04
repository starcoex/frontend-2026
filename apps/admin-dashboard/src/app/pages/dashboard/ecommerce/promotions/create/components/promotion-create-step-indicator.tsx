import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface Step {
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { label: '기본 정보', description: '이름 및 코드 설정' },
  { label: '할인 & 이미지', description: '할인 방식 및 이미지' },
  { label: '기간 & 제한', description: '적용 기간 및 사용 제한' },
  { label: '설정 & 확인', description: '상태 및 최종 확인' },
];

export const PROMOTION_TOTAL_STEPS = STEPS.length;

interface StepIndicatorProps {
  currentStep: number;
}

export function PromotionCreateStepIndicator({
  currentStep,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between">
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={step.label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  isCompleted &&
                    'bg-primary border-primary text-primary-foreground',
                  isCurrent && 'border-primary text-primary bg-background',
                  !isCompleted &&
                    !isCurrent &&
                    'border-muted-foreground/30 text-muted-foreground bg-background'
                )}
              >
                {isCompleted ? <CheckIcon className="size-4" /> : stepNumber}
              </div>
              <div className="hidden text-center sm:block">
                <p
                  className={cn(
                    'text-xs font-medium',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-muted-foreground text-xs">
                  {step.description}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors',
                  isCompleted ? 'bg-primary' : 'bg-muted-foreground/20'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
