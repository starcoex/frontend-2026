import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../utils/utils';

export interface SmartTimerProps {
  timeLeft: number;
  urgentThreshold?: number; // 기본값: 5분 (300000ms)
  criticalThreshold?: number; // 기본값: 1분 (60000ms)
  className?: string;
  showIcon?: boolean;
  label?: string;
  criticalMessage?: string;
}

export const SmartTimer = React.forwardRef<HTMLDivElement, SmartTimerProps>(
  (
    {
      timeLeft,
      urgentThreshold = 300000,
      criticalThreshold = 60000,
      className,
      showIcon = true,
      label = '남은 시간:',
      criticalMessage = '곧 만료!',
      ...props
    },
    ref
  ) => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    const isUrgent = timeLeft < urgentThreshold;
    const isCritical = timeLeft < criticalThreshold;

    const getTimerColor = () => {
      if (isCritical) return 'text-red-500';
      if (isUrgent) return 'text-amber-500';
      return 'text-slate-600 dark:text-slate-400';
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center gap-2 py-2', className)}
        {...props}
      >
        {showIcon && <Clock className={cn('h-4 w-4', getTimerColor())} />}
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn('text-sm font-mono font-semibold', getTimerColor())}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        {isCritical && criticalMessage && (
          <span className="text-xs text-red-500 ml-1">{criticalMessage}</span>
        )}
      </div>
    );
  }
);

SmartTimer.displayName = 'SmartTimer';
