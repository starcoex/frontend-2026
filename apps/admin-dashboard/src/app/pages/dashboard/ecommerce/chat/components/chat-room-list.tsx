import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import type { ChatRoom } from '@starcoex-frontend/chats';

const STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  ACTIVE: 'success',
  WAITING: 'warning',
  IN_PROGRESS: 'default',
  RESOLVED: 'secondary',
  CLOSED: 'outline',
  ARCHIVED: 'outline',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성',
  WAITING: '대기',
  IN_PROGRESS: '진행중',
  RESOLVED: '해결됨',
  CLOSED: '종료',
  ARCHIVED: '보관',
};

const PRIORITY_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'warning'
> = {
  LOW: 'outline',
  NORMAL: 'secondary',
  HIGH: 'warning',
  URGENT: 'destructive',
};

interface ChatRoomListProps {
  rooms: ChatRoom[];
  selectedRoomId: number | null;
  onSelect: (room: ChatRoom) => void;
}

export function ChatRoomList({
  rooms,
  selectedRoomId,
  onSelect,
}: ChatRoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        채팅방이 없습니다.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {/* ✅ index 를 fallback key 로 사용하여 중복 id 방어 */}
      {rooms.map((room, index) => (
        <div
          key={`room-${room.id}-${index}`}
          className={cn(
            'hover:bg-muted cursor-pointer px-4 py-3 transition-colors',
            selectedRoomId === room.id && 'bg-muted'
          )}
          onClick={() => onSelect(room)}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-medium">{room.title}</p>
            <span className="text-muted-foreground flex-none text-xs">
              {format(new Date(room.updatedAt), 'MM/dd HH:mm', { locale: ko })}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <Badge
              variant={STATUS_VARIANT[room.status] as any}
              className="h-5 text-xs"
            >
              {STATUS_LABEL[room.status] ?? room.status}
            </Badge>
            {room.chatPriority && room.chatPriority !== 'NORMAL' && (
              <Badge
                variant={PRIORITY_VARIANT[room.chatPriority] as any}
                className="h-5 text-xs"
              >
                {room.chatPriority === 'HIGH'
                  ? '높음'
                  : room.chatPriority === 'URGENT'
                  ? '긴급'
                  : room.chatPriority}
              </Badge>
            )}
            {room.typeDisplayName && (
              <span className="text-muted-foreground truncate text-xs">
                {room.typeDisplayName}
              </span>
            )}
          </div>
          {room.participants && room.participants.length > 0 && (
            <p className="text-muted-foreground mt-0.5 text-xs">
              참여자 {room.participants.length}명
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
