import { X, Loader2, Wifi, WifiOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ChatRoom } from '@starcoex-frontend/chats';
import type { ChatSocketStatus } from '@starcoex-frontend/chats';

interface GasChatRoomHeaderProps {
  room: ChatRoom;
  isParticipant: boolean;
  isLeaving: boolean;
  socketStatus: ChatSocketStatus;
  onlineCount: number;
  onLeave: () => void;
  onClose: () => void;
}

export function GasChatRoomHeader({
  room,
  isParticipant,
  isLeaving,
  socketStatus,
  onlineCount,
  onLeave,
  onClose,
}: GasChatRoomHeaderProps) {
  return (
    <div className="flex-shrink-0 border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold">{room.title}</h2>
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
          <div className="mt-0.5 flex items-center gap-1.5">
            <Badge
              variant={isParticipant ? 'default' : 'secondary'}
              className="h-4 text-xs"
            >
              {isParticipant ? '참여중' : '미참여'}
            </Badge>
            {room.typeDisplayName && (
              <span className="text-muted-foreground text-xs">
                {room.typeDisplayName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          {isParticipant && (
            <Button
              size="sm"
              variant="ghost"
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
          )}
          <Button
            aria-label="채팅 닫기"
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
