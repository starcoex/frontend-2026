import { X, RefreshCw } from 'lucide-react';
import { Button } from './ui';
import { cn } from '../utils';
import { usePwaUpdate } from '../hooks';

interface PwaUpdateBannerProps {
  className?: string;
}

export function PwaUpdateBanner({ className }: PwaUpdateBannerProps) {
  const { needsUpdate, isUpdating, update, dismiss } = usePwaUpdate();

  if (!needsUpdate) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 shadow-sm dark:border-blue-800 dark:bg-blue-950',
        className
      )}
    >
      {/* 아이콘 */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <RefreshCw
          className={cn(
            'h-4 w-4 text-blue-600 dark:text-blue-400',
            isUpdating && 'animate-spin'
          )}
        />
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight text-blue-900 dark:text-blue-100">
          새 버전이 있습니다
        </p>
        <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300">
          업데이트 후 더 나은 기능을 사용할 수 있습니다.
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
          onClick={update}
          disabled={isUpdating}
        >
          <RefreshCw
            className={cn('mr-1.5 h-3.5 w-3.5', isUpdating && 'animate-spin')}
          />
          {isUpdating ? '업데이트 중...' : '지금 업데이트'}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900"
          onClick={dismiss}
          disabled={isUpdating}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
