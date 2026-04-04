import { Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@starcoex-frontend/notifications';
import { NOTIFICATION_ROUTES } from '@/app/constants/notification-routes';
import {
  NOTIFICATION_BREADCRUMB_CONFIGS,
  DEFAULT_NOTIFICATION_BREADCRUMB_CONFIG,
  type BreadcrumbConfig,
} from '@/app/constants/notification-breadcrumb-config';
import { NotificationStats } from '@/app/pages/dashboard/ecommerce/notifications/components/notification-stats';
import { useAuth } from '@starcoex-frontend/auth';

const PATH_TO_CONFIG_MAP: Record<string, BreadcrumbConfig> = {
  [NOTIFICATION_ROUTES.LIST]: NOTIFICATION_BREADCRUMB_CONFIGS.LIST,
  [NOTIFICATION_ROUTES.SEND]: NOTIFICATION_BREADCRUMB_CONFIGS.SEND,
  [NOTIFICATION_ROUTES.EMAILS]: NOTIFICATION_BREADCRUMB_CONFIGS.EMAILS,
  [NOTIFICATION_ROUTES.STATS]: NOTIFICATION_BREADCRUMB_CONFIGS.STATS,
};

export const NotificationsLayout = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  const { fetchMyNotificationStats, stats, unreadCount } = useNotifications();

  useEffect(() => {
    if (!currentUser?.id) return;
    // ✅ 통계만 조회 — components 배열은 건드리지 않음
    fetchMyNotificationStats();
    // ❌ fetchUnreadNotifications 제거 — components 배열 오염 방지
  }, [fetchMyNotificationStats, currentUser?.id]);

  const config = useMemo((): BreadcrumbConfig => {
    return (
      PATH_TO_CONFIG_MAP[location.pathname] ??
      DEFAULT_NOTIFICATION_BREADCRUMB_CONFIG
    );
  }, [location.pathname]);

  return (
    <main className="flex h-full flex-1 flex-col p-4">
      <div className="mb-4 flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/admin">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {config.showInBreadcrumb && (
              <BreadcrumbItem>
                <BreadcrumbPage>{config.label}</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CardTitle className="flex-none text-2xl font-bold tracking-tight">
              {config.title}
            </CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="tabular-nums">
                {unreadCount}
              </Badge>
            )}
          </div>

          {config.showActions && (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={NOTIFICATION_ROUTES.EMAILS}>
                  <Mail className="mr-2 h-4 w-4" />
                  이메일 관리
                </Link>
              </Button>
              <Button asChild>
                <Link to={NOTIFICATION_ROUTES.SEND}>
                  <Send className="mr-2 h-4 w-4" />
                  알림 전송
                </Link>
              </Button>
            </div>
          )}
        </div>

        {config.showStats && (
          <NotificationStats stats={stats} unreadCount={unreadCount} />
        )}
      </div>

      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
};
