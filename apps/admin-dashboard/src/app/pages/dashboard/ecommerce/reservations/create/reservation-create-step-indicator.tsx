import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';

interface Step {
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { label: '매장 / 서비스', description: '매장과 서비스 선택' },
  { label: '날짜 / 시간', description: '예약 일정 선택' },
  { label: '고객 정보', description: '고객 정보 입력' },
  { label: '결제 정보', description: '결제 방식 및 금액' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function ReservationCreateStepIndicator({
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
            {/* 원 + 텍스트 */}
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

            {/* 연결선 */}
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

export const TOTAL_STEPS = STEPS.length;
