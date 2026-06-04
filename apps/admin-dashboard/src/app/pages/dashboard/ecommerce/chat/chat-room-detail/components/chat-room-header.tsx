import { X, Loader2, Wifi, WifiOff, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { ChatRoom, ChatRoomStatus } from '@starcoex-frontend/chats';
import { useChats } from '@starcoex-frontend/chats';
import {
  CHAT_STATUS_LABEL,
  CHAT_STATUS_TRANSITION_MAP,
} from '@/app/pages/dashboard/ecommerce/chat/data/chat-data';

function TooltipBtn({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children as React.ReactElement}
        </TooltipTrigger>
        <TooltipContent side="top">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface ChatRoomHeaderProps {
  room: ChatRoom;
  isParticipant: boolean;
  isLeaving: boolean;
  socketStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  onlineCount: number;
  onLeave: () => void;
  onClose: () => void;
  onEditOpen: () => void;
  onDeleteOpen: () => void;
}

export function ChatRoomHeader({
  room,
  isParticipant,
  isLeaving,
  socketStatus,
  onlineCount,
  onLeave,
  onClose,
  onEditOpen,
  onDeleteOpen,
}: ChatRoomHeaderProps) {
  const { updateChatRoomStatus } = useChats();
  const availableStatuses =
    CHAT_STATUS_TRANSITION_MAP[room.status as ChatRoomStatus] ?? [];

  return (
    <CardHeader className="flex-shrink-0 border-b py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <CardTitle className="truncate text-base">{room.title}</CardTitle>
            <span
              title={
                socketStatus === 'connected' ? '실시간 연결됨' : '연결 안 됨'
              }
            >
              {socketStatus === 'connected' ? (
                <Wifi className="size-3.5 text-green-500" />
              ) : (
                <WifiOff className="size-3.5 text-muted-foreground" />
              )}
            </span>
            {onlineCount > 0 && (
              <Badge variant="secondary" className="h-4 text-xs">
                온라인 {onlineCount}명
              </Badge>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {room.typeDisplayName && (
              <span className="text-muted-foreground text-xs">
                {room.typeDisplayName}
              </span>
            )}
            {room.orderId && (
              <Badge variant="outline" className="text-xs">
                주문 #{room.orderId}
              </Badge>
            )}
            <Badge
              variant={isParticipant ? 'success' : 'secondary'}
              className="text-xs"
            >
              {isParticipant ? '참여중' : '미참여'}
            </Badge>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          {availableStatuses.length > 0 ? (
            <Select
              value={room.status}
              onValueChange={async (s) => {
                const res = await updateChatRoomStatus(room.id, s);
                if (res.success) toast.success('상태가 변경되었습니다.');
                else toast.error(res.error?.message ?? '상태 변경 실패');
              }}
            >
              <SelectTrigger className="h-8 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={room.status} disabled>
                  {CHAT_STATUS_LABEL[room.status as ChatRoomStatus] ??
                    room.status}{' '}
                  (현재)
                </SelectItem>
                {availableStatuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {CHAT_STATUS_LABEL[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline" className="text-xs">
              {CHAT_STATUS_LABEL[room.status as ChatRoomStatus] ?? room.status}
            </Badge>
          )}

          <TooltipBtn label="채팅방 수정">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={onEditOpen}
            >
              수정
            </Button>
          </TooltipBtn>

          <TooltipBtn label="채팅방 삭제">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-destructive hover:text-destructive"
              onClick={onDeleteOpen}
            >
              삭제
            </Button>
          </TooltipBtn>

          {isParticipant && (
            <TooltipBtn label="채팅방 나가기">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs text-destructive hover:text-destructive"
                onClick={onLeave}
                disabled={isLeaving}
              >
                {isLeaving ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <LogOut className="size-3.5" />
                )}
                나가기
              </Button>
            </TooltipBtn>
          )}

          <Button
            aria-label="채팅방 닫기"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
