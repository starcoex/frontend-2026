import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { useNotifications } from '@starcoex-frontend/notifications';
import { NotificationStatus, PageHead } from '@starcoex-frontend/common';
import { APP_CONFIG } from '@/app/config/app.config';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { NotificationItemFull } from '@starcoex-frontend/common';

const LIMIT = 20;

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  const { currentUser } = useAuth();

  const {
    notifications,
    unreadCount,
    totalCount,
    hasNextPage,
    isLoading,
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    fetchMyNotifications({ userId: currentUser.id, limit: LIMIT, offset });
  }, [currentUser, offset]);

  const handleNotificationClick = async (notification: any) => {
    if (notification.status === NotificationStatus.UNREAD) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <>
      <PageHead
        title={`알림 - ${APP_CONFIG.seo.siteName}`}
        description="나의 알림 목록을 확인하세요."
        siteName={APP_CONFIG.seo.siteName}
        url={`https://${APP_CONFIG.app.currentDomain}/notifications`}
      />

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* 페이지 헤더 */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">알림</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  총 {totalCount}개
                  {unreadCount > 0 && ` · 읽지 않음 ${unreadCount}개`}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => markAllAsRead()}
                disabled={isLoading}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                모두 읽음
              </Button>
            )}
          </div>

          {/* 로딩 스켈레톤 */}
          {isLoading && notifications.length === 0 && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-5 w-2/3 mb-1" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 알림 없음 */}
          {!isLoading && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mb-4 opacity-30" />
              <p className="text-muted-foreground">새로운 알림이 없습니다</p>
            </div>
          )}

          {/* 알림 목록 — NotificationItemFull 공통 컴포넌트 사용 */}
          {notifications.length > 0 && (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItemFull
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onMarkAsRead={(id) => markAsRead(id)}
                  onDelete={(id) => deleteNotification(id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}

          {/* 더 보기 */}
          {hasNextPage && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                onClick={() => setOffset((prev) => prev + LIMIT)}
                disabled={isLoading}
              >
                {isLoading ? '불러오는 중...' : '더 보기'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
