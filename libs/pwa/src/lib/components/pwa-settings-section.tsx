import {
  Smartphone,
  Wifi,
  Bell,
  BellOff,
  BellRing,
  Trash2,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
} from 'lucide-react';
import { usePwaSettings, usePwaInstall } from '../hooks';
import { Button } from './ui';
import { cn } from '../utils';

interface PwaSettingsSectionProps {
  className?: string;
  onCacheCleared?: () => void;
}

// ── 개별 설정 행 ──────────────────────────────────────────────────────────────
interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: React.ReactNode;
  action?: React.ReactNode;
}

function SettingRow({
  icon,
  title,
  description,
  status,
  action,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {status}
        {action}
      </div>
    </div>
  );
}

// ── 상태 뱃지 ─────────────────────────────────────────────────────────────────
function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        active
          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          : 'bg-muted text-muted-foreground'
      )}
    >
      {active ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <XCircle className="h-3 w-3" />
      )}
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

// ── 알림 권한 뱃지 ────────────────────────────────────────────────────────────
function NotificationBadge({
  permission,
}: {
  permission: 'default' | 'granted' | 'denied';
}) {
  const config = {
    granted: {
      label: '허용됨',
      className:
        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      icon: <BellRing className="h-3 w-3" />,
    },
    denied: {
      label: '거부됨',
      className: 'bg-destructive/10 text-destructive',
      icon: <BellOff className="h-3 w-3" />,
    },
    default: {
      label: '미설정',
      className: 'bg-muted text-muted-foreground',
      icon: <Bell className="h-3 w-3" />,
    },
  };

  const { label, className, icon } = config[permission];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export function PwaSettingsSection({
  className,
  onCacheCleared,
}: PwaSettingsSectionProps) {
  const {
    isInstalled,
    isServiceWorkerActive,
    notificationPermission,
    isRequestingPermission,
    requestNotificationPermission,
    isClearingCache,
    clearCache,
  } = usePwaSettings();

  const { isInstallable, isIos, install } = usePwaInstall();

  const handleClearCache = async () => {
    await clearCache();
    onCacheCleared?.();
  };

  return (
    <div className={cn('space-y-1', className)}>
      {/* 구분선 포함 행 목록 */}
      <div className="divide-y rounded-lg border bg-card">
        {/* ── 앱 설치 상태 ── */}
        <SettingRow
          icon={<Smartphone className="h-4 w-4 text-muted-foreground" />}
          title="앱 설치"
          description={
            isInstalled
              ? '홈 화면에 설치된 상태입니다.'
              : '홈 화면에 추가하면 더 빠르게 이용할 수 있습니다.'
          }
          status={
            <StatusBadge
              active={isInstalled}
              activeLabel="설치됨"
              inactiveLabel="미설치"
            />
          }
          action={
            !isInstalled && isInstallable ? (
              isIos ? (
                <span className="text-xs text-muted-foreground">
                  공유 → 홈 화면 추가
                </span>
              ) : (
                <Button size="sm" className="h-8 text-xs" onClick={install}>
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  설치
                </Button>
              )
            ) : undefined
          }
        />

        {/* ── 오프라인 지원 ── */}
        <SettingRow
          icon={<Wifi className="h-4 w-4 text-muted-foreground" />}
          title="오프라인 지원"
          description={
            isServiceWorkerActive
              ? 'Service Worker가 활성화되어 오프라인에서도 이용 가능합니다.'
              : 'Service Worker가 비활성 상태입니다.'
          }
          status={
            <StatusBadge
              active={isServiceWorkerActive}
              activeLabel="활성"
              inactiveLabel="비활성"
            />
          }
        />

        {/* ── 푸시 알림 권한 ── */}
        <SettingRow
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          title="푸시 알림"
          description={
            notificationPermission === 'granted'
              ? '푸시 알림을 수신할 수 있습니다.'
              : notificationPermission === 'denied'
              ? '브라우저 설정에서 알림 권한을 허용해주세요.'
              : '알림 권한을 허용하면 중요한 소식을 받을 수 있습니다.'
          }
          status={<NotificationBadge permission={notificationPermission} />}
          action={
            notificationPermission === 'default' ? (
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={requestNotificationPermission}
                disabled={isRequestingPermission}
              >
                {isRequestingPermission ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Bell className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isRequestingPermission ? '요청 중...' : '허용하기'}
              </Button>
            ) : notificationPermission === 'denied' ? (
              <span className="text-xs text-muted-foreground">
                브라우저 설정에서 변경
              </span>
            ) : undefined
          }
        />

        {/* ── 캐시 초기화 ── */}
        <SettingRow
          icon={<Trash2 className="h-4 w-4 text-muted-foreground" />}
          title="캐시 초기화"
          description="저장된 캐시를 삭제합니다. 앱이 최신 데이터를 새로 불러옵니다."
          status={<span />}
          action={
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleClearCache}
              disabled={isClearingCache}
            >
              {isClearingCache ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              {isClearingCache ? '초기화 중...' : '캐시 삭제'}
            </Button>
          }
        />
      </div>
    </div>
  );
}
