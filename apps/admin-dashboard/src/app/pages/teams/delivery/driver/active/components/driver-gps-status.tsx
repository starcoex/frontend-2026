import { MapPin, MapPinOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { GpsStatus } from '../hooks/useDriverGps';

interface DriverGpsStatusProps {
  gpsStatus: GpsStatus;
  lastSentAt: Date | null;
  currentPosition: GeolocationCoordinates | null;
  onStart: () => void;
  onStop: () => void;
}

export function DriverGpsStatus({
  gpsStatus,
  lastSentAt,
  currentPosition,
  onStart,
  onStop,
}: DriverGpsStatusProps) {
  const configs = {
    idle: {
      icon: MapPinOff,
      text: 'GPS 전송이 중지되어 있습니다.',
      className: 'border-muted bg-muted text-muted-foreground',
    },
    watching: {
      icon: MapPin,
      text: '실시간 위치 전송 중',
      className: 'border-primary/30 bg-primary/5 text-primary',
    },
    error: {
      icon: AlertTriangle,
      text: 'GPS 오류 — 위치 권한을 확인하세요.',
      className: 'border-destructive/30 bg-destructive/5 text-destructive',
    },
    unsupported: {
      icon: MapPinOff,
      text: '이 기기는 GPS를 지원하지 않습니다.',
      className: 'border-muted bg-muted text-muted-foreground',
    },
  } as const;

  const { icon: Icon, text, className } = configs[gpsStatus];

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border px-4 py-2 text-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <div>
          <span>{text}</span>
          {gpsStatus === 'watching' && currentPosition && (
            <p className="text-xs opacity-70">
              {currentPosition.latitude.toFixed(5)},{' '}
              {currentPosition.longitude.toFixed(5)}
              {lastSentAt && (
                <span className="ml-2">
                  · 마지막 전송{' '}
                  {lastSentAt.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* 수동 토글 버튼 */}
      {gpsStatus === 'watching' ? (
        <Button
          size="sm"
          variant="outline"
          onClick={onStop}
          className="shrink-0"
        >
          중지
        </Button>
      ) : gpsStatus !== 'unsupported' ? (
        <Button size="sm" onClick={onStart} className="shrink-0">
          <RefreshCw className="mr-1 h-3.5 w-3.5" />
          시작
        </Button>
      ) : null}
    </div>
  );
}
