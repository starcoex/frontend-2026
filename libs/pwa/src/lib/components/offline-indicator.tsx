import { Wifi, WifiOff } from 'lucide-react';
import { useNetworkStatus } from '../hooks';
import { cn } from '../utils';

interface OfflineIndicatorProps {
  className?: string;
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const { isOffline, justReconnected } = useNetworkStatus();

  // 온라인이고 재연결 알림도 없으면 렌더 안 함
  if (!isOffline && !justReconnected) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3 shadow-sm transition-all duration-300',
        isOffline
          ? 'border-destructive/30 bg-destructive/10'
          : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        className
      )}
    >
      {/* 아이콘 */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          isOffline ? 'bg-destructive/10' : 'bg-green-100 dark:bg-green-900'
        )}
      >
        {isOffline ? (
          <WifiOff className="h-4 w-4 text-destructive" />
        ) : (
          <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
        )}
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            isOffline
              ? 'text-destructive'
              : 'text-green-900 dark:text-green-100'
          )}
        >
          {isOffline ? '인터넷 연결이 끊겼습니다' : '다시 연결되었습니다'}
        </p>
        <p
          className={cn(
            'mt-0.5 text-xs',
            isOffline
              ? 'text-destructive/80'
              : 'text-green-700 dark:text-green-300'
          )}
        >
          {isOffline
            ? '일부 기능이 제한될 수 있습니다. 캐시된 데이터만 표시됩니다.'
            : '정상적으로 서비스를 이용할 수 있습니다.'}
        </p>
      </div>

      {/* 오프라인 상태 표시 점 */}
      {isOffline && (
        <div className="shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive" />
          </span>
        </div>
      )}
    </div>
  );
}
