import React from 'react';
import { Star, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '../../utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Progress,
} from '../ui';

interface StarProgressProps {
  currentStars: number;
  targetStars: number;
  currentTier: string;
  nextTier?: string;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const tierColors: Record<string, { bg: string; fill: string; text: string }> = {
  WELCOME: {
    bg: 'bg-slate-100 dark:bg-slate-800',
    fill: 'bg-slate-500',
    text: 'text-slate-600',
  },
  SHINE: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    fill: 'bg-blue-500',
    text: 'text-blue-600',
  },
  STAR: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    fill: 'bg-amber-500',
    text: 'text-amber-600',
  },
};

export const StarProgress: React.FC<StarProgressProps> = ({
  currentStars,
  targetStars,
  currentTier,
  nextTier,
  showAnimation = true,
  size = 'md',
  className,
}) => {
  const progress = Math.min((currentStars / targetStars) * 100, 100);
  const remainingStars = Math.max(targetStars - currentStars, 0);
  const isComplete = progress >= 100;

  const colors = tierColors[currentTier] || tierColors.WELCOME;
  const nextColors = nextTier ? tierColors[nextTier] : null;

  const sizeClasses = {
    sm: {
      container: 'gap-2',
      icon: 'h-4 w-4',
      text: 'text-xs',
      progress: 'h-1.5',
      stars: 'text-sm',
    },
    md: {
      container: 'gap-3',
      icon: 'h-5 w-5',
      text: 'text-sm',
      progress: 'h-2',
      stars: 'text-base',
    },
    lg: {
      container: 'gap-4',
      icon: 'h-6 w-6',
      text: 'text-base',
      progress: 'h-3',
      stars: 'text-lg',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={cn('space-y-2', className)}>
      {/* 상단 정보 */}
      <div className={cn('flex items-center justify-between', sizes.container)}>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full',
                    colors.bg
                  )}
                >
                  <Star
                    className={cn(sizes.icon, 'text-amber-500 fill-amber-500')}
                  />
                  <span className={cn('font-bold', sizes.stars)}>
                    {currentStars}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>현재 보유 별: {currentStars}개</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {nextTier && (
          <div className={cn('flex items-center gap-1', sizes.text)}>
            {isComplete ? (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <Sparkles className={cn(sizes.icon, 'animate-pulse')} />
                승급 가능!
              </span>
            ) : (
              <span className="text-muted-foreground">
                <span className={cn('font-medium', nextColors?.text)}>
                  {nextTier}
                </span>
                까지{' '}
                <span className="font-bold text-foreground">
                  {remainingStars}별
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 진행 바 */}
      <div className="relative">
        <Progress
          value={progress}
          className={cn(sizes.progress, 'bg-muted/50')}
        />

        {/* 마일스톤 표시 */}
        {size !== 'sm' && (
          <div className="absolute inset-0 flex items-center">
            {[25, 50, 75].map((milestone) => (
              <div
                key={milestone}
                className="absolute h-full w-px bg-background/50"
                style={{ left: `${milestone}%` }}
              />
            ))}
          </div>
        )}

        {/* 애니메이션 효과 */}
        {showAnimation && progress > 0 && progress < 100 && (
          <div
            className="absolute top-0 h-full w-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"
            style={{
              left: `${progress}%`,
              transform: 'translateX(-50%)',
            }}
          />
        )}
      </div>

      {/* 하단 레이블 */}
      <div
        className={cn(
          'flex items-center justify-between',
          sizes.text,
          'text-muted-foreground'
        )}
      >
        <span>{currentTier}</span>
        {nextTier && (
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>{nextTier}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// 간단한 별 적립 애니메이션 컴포넌트
interface StarEarnedAnimationProps {
  stars: number;
  onComplete?: () => void;
}

export const StarEarnedAnimation: React.FC<StarEarnedAnimationProps> = ({
  stars,
  onComplete,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="animate-bounce-in flex flex-col items-center gap-2">
        <div className="relative">
          <Star className="h-16 w-16 text-amber-500 fill-amber-500 animate-pulse" />
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 animate-spin" />
        </div>
        <div className="text-2xl font-bold text-amber-500">+{stars} 별</div>
      </div>
    </div>
  );
};

// 별 수집 진행률 원형 표시
interface CircularStarProgressProps {
  current: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularStarProgress: React.FC<CircularStarProgressProps> = ({
  current,
  target,
  size = 120,
  strokeWidth = 8,
  className,
}) => {
  const progress = Math.min((current / target) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
        />
        {/* 진행 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-amber-500 transition-all duration-500 ease-out"
        />
      </svg>

      {/* 중앙 내용 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Star className="h-6 w-6 text-amber-500 fill-amber-500 mb-1" />
        <span className="text-2xl font-bold">{current}</span>
        <span className="text-xs text-muted-foreground">/ {target}</span>
      </div>
    </div>
  );
};
