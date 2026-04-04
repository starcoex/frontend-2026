import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../utils';
import {
  NotificationItem as NotificationItemType,
  NotificationStatus,
  NOTIFICATION_TYPE_CONFIG,
} from '../../types';

// ── 공통 유틸 ────────────────────────────────────────────────────────────────

const getConfig = (type: NotificationItemType['type']) =>
  NOTIFICATION_TYPE_CONFIG[type] ?? NOTIFICATION_TYPE_CONFIG['GENERAL'];

const getTimeAgo = (createdAt: string) =>
  formatDistanceToNow(new Date(createdAt), { addSuffix: true, locale: ko });

const isExpiredNotification = (expiresAt?: string | null) =>
  !!expiresAt && new Date(expiresAt) < new Date();

// ── 컴팩트 모드 (드롭다운용) ─────────────────────────────────────────────────

interface NotificationItemCompactProps {
  notification: NotificationItemType;
  onClick: (notification: NotificationItemType) => void;
  onDelete?: (id: number) => void;
  isLoading?: boolean;
}

export const NotificationItemCompact: React.FC<
  NotificationItemCompactProps
> = ({ notification, onClick, onDelete, isLoading = false }) => {
  const isUnread = notification.status === NotificationStatus.UNREAD;
  const isExpired = isExpiredNotification(notification.expiresAt);
  const config = getConfig(notification.type);
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group flex items-start gap-3 px-3 py-2.5 cursor-pointer',
        'hover:bg-muted/50 transition-colors',
        isUnread && 'bg-primary/5 border-l-2 border-l-primary',
        isExpired && 'opacity-60'
      )}
      onClick={() => onClick(notification)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(notification)}
    >
      {/* 읽음 상태 dot */}
      <div className="mt-1.5 flex-shrink-0">
        {isUnread ? (
          <Circle className="w-2 h-2 fill-primary text-primary" />
        ) : (
          <CheckCircle className="w-2 h-2 text-muted-foreground/40" />
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <Badge
            variant="secondary"
            className={cn('text-xs px-1.5 py-0', config.color)}
          >
            {config.icon} {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
        </div>
        <p
          className={cn(
            'text-sm truncate',
            isUnread
              ? 'font-semibold text-foreground'
              : 'font-medium text-muted-foreground'
          )}
        >
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {notification.message}
        </p>
      </div>

      {/* 삭제 버튼 */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'flex-shrink-0 w-6 h-6 p-0',
            'opacity-0 group-hover:opacity-100 transition-opacity',
            'hover:bg-destructive hover:text-destructive-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          disabled={isLoading}
          aria-label="알림 삭제"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};

// ── 풀 모드 (전체 목록 페이지용) ─────────────────────────────────────────────

interface NotificationItemFullProps {
  notification: NotificationItemType;
  onClick: (notification: NotificationItemType) => void;
  onDelete?: (id: number) => void;
  onMarkAsRead?: (id: number) => void;
  isLoading?: boolean;
}

export const NotificationItemFull: React.FC<NotificationItemFullProps> = ({
  notification,
  onClick,
  onDelete,
  onMarkAsRead,
  isLoading = false,
}) => {
  const isUnread = notification.status === NotificationStatus.UNREAD;
  const isExpired = isExpiredNotification(notification.expiresAt);
  const config = getConfig(notification.type);
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        'group flex gap-4 p-4 rounded-lg cursor-pointer',
        'hover:bg-muted/50 transition-colors',
        isUnread && 'bg-primary/5 border-l-4 border-l-primary',
        isExpired && 'opacity-60'
      )}
      onClick={() => onClick(notification)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(notification)}
    >
      {/* 타입 아이콘 */}
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
        {config.icon}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge variant="secondary" className={cn('text-xs', config.color)}>
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          {isUnread && (
            <Badge variant="default" className="text-xs">
              NEW
            </Badge>
          )}
          {isExpired && (
            <Badge variant="destructive" className="text-xs">
              만료
            </Badge>
          )}
        </div>
        <h4
          className={cn(
            'text-sm mb-1',
            isUnread
              ? 'font-semibold text-foreground'
              : 'font-medium text-muted-foreground'
          )}
        >
          {notification.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {notification.message}
        </p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {isUnread && onMarkAsRead && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            disabled={isLoading}
            aria-label="읽음 처리"
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            disabled={isLoading}
            aria-label="알림 삭제"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
};
