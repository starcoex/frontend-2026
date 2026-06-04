import { Bell, BellOff, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePushNotification } from '@starcoex-frontend/notifications';
import { cn } from '../../utils';
import { Button } from '../ui';

const DISMISSED_KEY = 'push_banner_dismissed';
const DENIED_DISMISSED_KEY = 'push_banner_denied_dismissed';

interface PushNotificationBannerProps {
  userId: number;
  deviceId?: string;
  className?: string;
}

export function PushNotificationBanner({
  userId,
  deviceId,
  className,
}: PushNotificationBannerProps) {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(DISMISSED_KEY) === 'true'
  );
  const [deniedDismissed, setDeniedDismissed] = useState(
    () => localStorage.getItem(DENIED_DISMISSED_KEY) === 'true'
  );

  const { state, isLoading, subscribe } = usePushNotification({
    userId,
    deviceId,
  });

  // ── 렌더링 조건 ──────────────────────────────────────────────────────────────
  // 지원 안 함 / 이미 구독 / 로딩 중 → 숨김
  if (
    state === 'unsupported' ||
    state === 'subscribed' ||
    state === 'loading'
  ) {
    return null;
  }

  // default 상태 → 닫은 경우 숨김
  if (state === 'default' && dismissed) return null;

  // denied 상태 → 닫은 경우 숨김
  if (state === 'denied' && deniedDismissed) return null;

  const isDenied = state === 'denied';

  const handleDismiss = () => {
    if (isDenied) {
      localStorage.setItem(DENIED_DISMISSED_KEY, 'true');
      setDeniedDismissed(true);
    } else {
      localStorage.setItem(DISMISSED_KEY, 'true');
      setDismissed(true);
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-3',
        isDenied
          ? 'border-destructive/30 bg-destructive/10'
          : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        className
      )}
    >
      {/* 아이콘 */}
      <div
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          isDenied ? 'bg-destructive/10' : 'bg-blue-100 dark:bg-blue-900'
        )}
      >
        {isDenied ? (
          <BellOff className="h-4 w-4 text-destructive" />
        ) : (
          <Bell className="h-4 w-4 text-blue-500" />
        )}
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            'text-sm font-medium leading-tight',
            isDenied ? 'text-destructive' : 'text-blue-900 dark:text-blue-100'
          )}
        >
          {isDenied ? '푸시 알림이 차단되었습니다' : '푸시 알림 받기'}
        </p>
        <p
          className={cn(
            'mt-0.5 text-xs',
            isDenied
              ? 'text-destructive/80'
              : 'text-blue-700 dark:text-blue-300'
          )}
        >
          {isDenied
            ? '브라우저 설정에서 알림 권한을 허용해주세요.'
            : '주문, 재고 등 중요 알림을 실시간으로 받아보세요.'}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex shrink-0 items-center gap-2">
        {/* default 상태 → 허용 버튼 */}
        {!isDenied && (
          <Button
            size="sm"
            className="h-8 bg-blue-600 text-xs text-white hover:bg-blue-700"
            onClick={() => subscribe()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Bell className="mr-1.5 h-3.5 w-3.5" />
            )}
            {isLoading ? '처리 중...' : '허용'}
          </Button>
        )}

        {/* denied 상태 → 브라우저 설정으로 안내 */}
        {isDenied && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => window.open('about:preferences#privacy', '_blank')}
          >
            설정 열기
          </Button>
        )}

        {/* 닫기 버튼 */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            'h-8 w-8',
            isDenied
              ? 'text-destructive hover:bg-destructive/10'
              : 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900'
          )}
          onClick={handleDismiss}
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
