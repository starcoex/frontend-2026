import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, Settings } from 'lucide-react';
import { useAuth } from '@starcoex-frontend/auth';
import { useNotifications } from '@starcoex-frontend/notifications';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { NotificationItemCompact } from './notification-item';
import { NotificationEmpty } from './notification-empty';
import { NotificationItem, NotificationStatus } from '../../types';
import { cn } from '../../utils';

export interface NotificationDropdownProps {
  maxItems?: number;
  onViewAll?: () => void;
  onSettings?: () => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  maxItems = 5,
  onViewAll,
  onSettings,
  onNotificationClick,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // ── 로그인 유저 ID 직접 가져오기 ──────────────────────────────────────────
  const { currentUser } = useAuth();
  const userId = currentUser?.id ?? null;

  const {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const loadNotifications = useCallback(() => {
    // userId가 없으면 (비로그인) 호출하지 않음
    if (!userId) return;

    fetchMyNotifications({
      userId,
      limit: maxItems,
      offset: 0,
    });
  }, [userId, maxItems, fetchMyNotifications]);

  // 마운트 시 unreadCount 파악용 초기 로드
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 드롭다운 열릴 때 최신 알림 로드
  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen, loadNotifications]);

  const recentNotifications = notifications.slice(
    0,
    maxItems
  ) as NotificationItem[];
  const hasUnread = unreadCount > 0;
  const extraCount = Math.max(0, totalCount - maxItems);

  const handleNotificationClick = useCallback(
    async (notification: NotificationItem) => {
      if (notification.status === NotificationStatus.UNREAD) {
        await markAsRead(notification.id);
      }
      setIsOpen(false);
      onNotificationClick?.(notification);
    },
    [markAsRead, onNotificationClick]
  );

  const handleViewAll = useCallback(() => {
    setIsOpen(false);
    onViewAll?.();
  }, [onViewAll]);

  const handleSettings = useCallback(() => {
    setIsOpen(false);
    onSettings?.();
  }, [onSettings]);

  // 비로그인 시 렌더링하지 않음
  if (!userId) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      {/* ── 트리거: 벨 아이콘 + 뱃지 ── */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative w-9 h-9 p-0 bg-transparent hover:bg-accent"
          disabled={isLoading}
          aria-label={hasUnread ? `알림 ${unreadCount}개 읽지 않음` : '알림'}
        >
          <Bell className="w-4 h-4" />
          {hasUnread && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px] font-bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      {/* ── 드롭다운 패널 ── */}
      <DropdownMenuContent
        className={cn('w-80 p-0', className)}
        align="end"
        sideOffset={8}
      >
        {/* 헤더 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">
              {hasUnread ? `알림 (${unreadCount}개 읽지 않음)` : '알림'}
            </h3>
            {totalCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                총 {totalCount}개
              </p>
            )}
          </div>
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => markAllAsRead()}
              disabled={isLoading}
            >
              <CheckCheck className="w-3 h-3 mr-1" />
              모두 읽음
            </Button>
          )}
        </div>

        <Separator />

        {/* 알림 목록 */}
        <div className="overflow-y-auto max-h-80">
          {recentNotifications.length === 0 ? (
            <NotificationEmpty />
          ) : (
            <div className="py-1">
              {recentNotifications.map((notification) => (
                <NotificationItemCompact
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                  onDelete={(id) => deleteNotification(id)}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        {(onViewAll || onSettings) && (
          <>
            <Separator />
            <div className="p-2 flex gap-1">
              {onViewAll && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-center text-xs h-8"
                  onClick={handleViewAll}
                >
                  모든 알림 보기
                  {extraCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-1.5 text-xs px-1.5"
                    >
                      +{extraCount}
                    </Badge>
                  )}
                </Button>
              )}
              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={handleSettings}
                  aria-label="알림 설정"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
