import { Bell, BellOff, Loader2 } from 'lucide-react';
import { usePushNotification } from '@starcoex-frontend/notifications';
import { cn } from '../../utils';
import { Switch } from '../ui';

interface PushNotificationToggleProps {
  userId: number;
  deviceId?: string;
  className?: string;
}

export function PushNotificationToggle({
  userId,
  deviceId,
  className,
}: PushNotificationToggleProps) {
  const { state, isLoading, subscribe, unsubscribe } = usePushNotification({
    userId,
    deviceId,
  });

  if (state === 'unsupported') return null;

  const isSubscribed = state === 'subscribed';
  const isDenied = state === 'denied';
  const isInitializing = state === 'loading';
  const isBusy = isLoading || isInitializing;

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      {/* 아이콘 + 텍스트 */}
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            isSubscribed ? 'bg-green-100 dark:bg-green-900' : 'bg-muted'
          )}
        >
          {isBusy ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : isSubscribed ? (
            <Bell className="h-4 w-4 text-green-600 dark:text-green-400" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">
            {isSubscribed ? '푸시 알림 켜짐' : '푸시 알림 꺼짐'}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {isDenied
              ? '브라우저 설정에서 알림 권한을 허용해주세요.'
              : isSubscribed
              ? '중요 알림을 실시간으로 수신 중입니다.'
              : '알림을 허용하면 중요 소식을 받을 수 있습니다.'}
          </p>
          {isDenied && (
            <p className="mt-0.5 text-xs text-destructive">
              브라우저 설정에서 알림 권한을 허용해주세요.
            </p>
          )}
        </div>
      </div>

      {/* 토글 */}
      <div className="shrink-0">
        <Switch
          checked={isSubscribed}
          onCheckedChange={() => (isSubscribed ? unsubscribe() : subscribe())}
          disabled={isBusy || isDenied}
          className="data-[state=checked]:bg-green-500"
          aria-label="푸시 알림 토글"
        />
      </div>
    </div>
  );
}
