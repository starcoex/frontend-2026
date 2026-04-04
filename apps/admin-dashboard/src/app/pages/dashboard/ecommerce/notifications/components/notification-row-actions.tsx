import { useState } from 'react';
import {
  MoreHorizontal,
  CheckCheck,
  Trash2,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  type Notification,
  NotificationStatus,
  useNotifications,
} from '@starcoex-frontend/notifications';
import {
  NOTIFICATION_CHANNEL_LABEL,
  NOTIFICATION_TYPE_LABEL,
} from '@/app/pages/dashboard/ecommerce/notifications/data/notification-data';

interface NotificationRowActionsProps {
  notification: Notification;
}

export function NotificationRowActions({
  notification,
}: NotificationRowActionsProps) {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isUnread = notification.status === NotificationStatus.UNREAD;

  const handleMarkAsRead = async () => {
    if (!isUnread) return;
    const res = await markAsRead(notification.id);
    if (res.success) {
      toast.success('알림을 읽음 처리했습니다.');
    } else {
      toast.error(res.error?.message ?? '처리에 실패했습니다.');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteNotification(notification.id);
      if (res.success) {
        toast.success('알림이 삭제되었습니다.');
      } else {
        toast.error(res.error?.message ?? '삭제에 실패했습니다.');
      }
    } finally {
      setIsDeleting(false);
      setDeleteOpen(false);
    }
  };

  /**
   * actionUrl 이동 처리
   * - 절대 URL(http/https): origin이 같으면 내부 이동, 다르면 새 탭
   * - 상대 경로(/orders/18): /admin 접두어 보정 후 내부 이동
   */
  const handleLinkMove = () => {
    if (!notification.actionUrl) return;

    try {
      const url = new URL(notification.actionUrl);
      if (url.origin === window.location.origin) {
        // 같은 도메인 — pathname에 /admin 없으면 보정
        const pathname = ensureAdminPrefix(url.pathname);
        navigate(pathname);
      } else {
        window.open(notification.actionUrl, '_blank', 'noopener,noreferrer');
      }
    } catch {
      // 상대 경로인 경우
      const pathname = ensureAdminPrefix(notification.actionUrl);
      navigate(pathname);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">메뉴 열기</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>액션</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDetailOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            상세 보기
          </DropdownMenuItem>
          {isUnread && (
            <DropdownMenuItem onSelect={handleMarkAsRead}>
              <CheckCheck className="mr-2 h-4 w-4" />
              읽음 처리
            </DropdownMenuItem>
          )}
          {notification.actionUrl && (
            <DropdownMenuItem onSelect={handleLinkMove}>
              <ExternalLink className="mr-2 h-4 w-4" />
              관련 페이지 이동
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setDeleteOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── 상세 보기 다이얼로그 ─────────────────────────────────────────── */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="leading-normal">
              {notification.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">{notification.message}</p>

            <div className="divide-y rounded-md border">
              <Row label="상태">
                <Badge
                  variant={isUnread ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {isUnread ? '읽지 않음' : '읽음'}
                </Badge>
              </Row>
              <Row label="타입">
                <Badge variant="secondary" className="text-xs">
                  {NOTIFICATION_TYPE_LABEL[notification.type]}
                </Badge>
              </Row>
              <Row label="채널">
                {NOTIFICATION_CHANNEL_LABEL[notification.channel]}
              </Row>
              <Row label="수신자 ID">#{notification.userId}</Row>
              {notification.relatedEntityType && (
                <Row label="연결 데이터">
                  {notification.relatedEntityType}
                  {notification.relatedEntityId
                    ? ` #${notification.relatedEntityId}`
                    : ''}
                </Row>
              )}
              {notification.actionUrl && (
                <Row label="이동 경로">
                  <button
                    type="button"
                    onClick={() => {
                      setDetailOpen(false);
                      handleLinkMove();
                    }}
                    className="text-primary max-w-[200px] truncate text-xs underline underline-offset-2"
                  >
                    {/* 표시는 /admin 보정 후 경로로 */}
                    {ensureAdminPrefix(
                      (() => {
                        try {
                          return new URL(notification.actionUrl!).pathname;
                        } catch {
                          return notification.actionUrl!;
                        }
                      })()
                    )}
                  </button>
                </Row>
              )}
              {notification.readAt && (
                <Row label="읽은 시간">
                  {format(new Date(notification.readAt), 'yyyy/MM/dd HH:mm', {
                    locale: ko,
                  })}
                </Row>
              )}
              <Row label="생성일">
                {format(new Date(notification.createdAt), 'yyyy/MM/dd HH:mm', {
                  locale: ko,
                })}
              </Row>
            </div>

            <div className="flex gap-2">
              {isUnread && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    handleMarkAsRead();
                    setDetailOpen(false);
                  }}
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  읽음 처리
                </Button>
              )}
              {notification.actionUrl && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setDetailOpen(false);
                    handleLinkMove();
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  관련 페이지 이동
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── 삭제 확인 ───────────────────────────────────────────────────── */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-semibold">{notification.title}</span> 알림을
              삭제합니다. 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/**
 * pathname에 /admin 접두어가 없으면 자동 보정
 * /orders/18 → /admin/orders/18
 * /admin/orders/18 → /admin/orders/18 (그대로)
 */
function ensureAdminPrefix(pathname: string): string {
  if (!pathname) return pathname;
  if (pathname.startsWith('/admin')) return pathname;
  return `/admin${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xs font-medium">{children}</span>
    </div>
  );
}
