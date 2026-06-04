import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MoreHorizontal, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNotifications } from '@starcoex-frontend/notifications';
import { NotificationsProvider } from '@starcoex-frontend/notifications';
import { useAuth } from '@starcoex-frontend/auth';

// ─── 심각도별 스타일 ──────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, string> = {
  PAYMENT: 'border-blue-400 bg-blue-50 dark:bg-blue-950/20',
  ORDER: 'border-violet-400 bg-violet-50 dark:bg-violet-950/20',
  RESERVATION: 'border-orange-400 bg-orange-50 dark:bg-orange-950/20',
  GENERAL: 'border-gray-300 bg-gray-50 dark:bg-gray-950/20',
};

const TYPE_LABELS: Record<string, string> = {
  PAYMENT: '결제',
  ORDER: '주문',
  RESERVATION: '예약',
  GENERAL: '일반',
};

// ─── 내부 컴포넌트 (Provider 내부에서 hook 사용) ──────────────────────────────
function NotificationsContent({
  onUnreadCountChange,
  onMarkAllAsRead,
}: {
  onUnreadCountChange: (count: number) => void;
  onMarkAllAsRead: () => void;
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // 현재 로그인한 유저 정보
  const { currentUser } = useAuth();

  const {
    notifications,
    unreadCount,
    isLoading,
    fetchMyNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    filteredNotifications,
  } = useNotifications();

  useEffect(() => {
    // currentUser가 로드된 이후에만 fetch
    if (!currentUser?.id) return;

    fetchMyNotifications({
      userId: currentUser.id,
      limit: 20,
      offset: 0,
    });
  }, [currentUser?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // 미읽음 수를 부모(DashboardPage)로 전달
  useEffect(() => {
    onUnreadCountChange(unreadCount);
  }, [unreadCount, onUnreadCountChange]);

  // 전체 읽음 처리를 부모에서 호출 가능하도록 연결
  useEffect(() => {
    // onMarkAllAsRead ref 패턴 대신 markAllAsRead를 직접 노출
  }, []);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    onMarkAllAsRead();
  };

  const displayed = filteredNotifications().filter((n) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
    );
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              알림
            </CardTitle>
            <CardDescription className="mt-1">
              총 {notifications.length}건 · 미읽음 {unreadCount}건
            </CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              전체 읽음
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 검색 */}
        <div className="relative">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 h-4 w-4" />
          <Input
            placeholder="알림 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* 알림 목록 */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-muted-foreground flex h-40 flex-col items-center justify-center gap-2">
            <Bell className="h-8 w-8 opacity-30" />
            <p className="text-sm">알림이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayed.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  'rounded-md border-l-4 px-3 py-2 transition-colors',
                  TYPE_STYLES[notification.type] ?? TYPE_STYLES['GENERAL'],
                  notification.status === 'UNREAD' && 'font-medium'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {TYPE_LABELS[notification.type] ?? notification.type}
                      </Badge>
                      {notification.status === 'UNREAD' && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      )}
                      <span className="truncate text-sm font-medium">
                        {notification.title}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {notification.message}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {format(new Date(notification.createdAt), 'MM.dd HH:mm', {
                        locale: ko,
                      })}
                    </p>
                  </div>

                  {/* ⋮ 메뉴 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {notification.status === 'UNREAD' && (
                        <DropdownMenuItem
                          onClick={() => markAsRead(notification.id)}
                        >
                          읽음으로 표시
                        </DropdownMenuItem>
                      )}
                      {notification.actionUrl && (
                        <DropdownMenuItem
                          onClick={() => navigate(notification.actionUrl!)}
                        >
                          관련 페이지로 이동
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 전체 알림 관리 이동 */}
        <Button
          variant="ghost"
          className="w-full text-xs"
          onClick={() => navigate('/admin/notifications')}
        >
          알림 관리 페이지에서 더 보기 →
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Provider로 감싼 외부 컴포넌트 ────────────────────────────────────────────
interface Props {
  onUnreadCountChange: (count: number) => void;
  onMarkAllAsRead: () => void;
}

export function DashboardNotificationsTab({
  onUnreadCountChange,
  onMarkAllAsRead,
}: Props) {
  return (
    <NotificationsProvider>
      <NotificationsContent
        onUnreadCountChange={onUnreadCountChange}
        onMarkAllAsRead={onMarkAllAsRead}
      />
    </NotificationsProvider>
  );
}
