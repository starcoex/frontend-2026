import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { CardContent } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import type { ChatRoom, ChatRoomStatus } from '@starcoex-frontend/chats';
import { CHAT_STATUS_LABEL } from '@/app/pages/dashboard/ecommerce/chat/data/chat-data';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

interface ChatRoomInfoTabProps {
  room: ChatRoom;
}

export function ChatRoomInfoTab({ room }: ChatRoomInfoTabProps) {
  return (
    <TabsContent
      value="info"
      className="mt-0 min-h-0 flex-1 overflow-auto px-4 data-[state=inactive]:hidden"
    >
      <CardContent className="space-y-3 px-0 py-3">
        <InfoRow label="채팅방 ID" value={`#${room.id}`} />
        <InfoRow label="유형" value={room.typeDisplayName ?? room.type} />
        <InfoRow
          label="상태"
          value={
            CHAT_STATUS_LABEL[room.status as ChatRoomStatus] ?? room.status
          }
        />
        {room.category && <InfoRow label="카테고리" value={room.category} />}
        {room.chatPriority && (
          <InfoRow label="우선순위" value={room.chatPriority} />
        )}
        {room.orderId && (
          <InfoRow label="연결 주문" value={`#${room.orderId}`} />
        )}
        {room.deliveryId && (
          <InfoRow label="연결 배송" value={`#${room.deliveryId}`} />
        )}
        {room.storeId && (
          <InfoRow label="연결 매장" value={`#${room.storeId}`} />
        )}
        {room.tags.length > 0 && (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground w-28 flex-shrink-0 text-xs">
              태그
            </span>
            <div className="flex flex-wrap gap-1">
              {room.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <InfoRow
          label="생성일"
          value={format(new Date(room.createdAt), 'yyyy.MM.dd HH:mm', {
            locale: ko,
          })}
        />
        <InfoRow
          label="최근 업데이트"
          value={format(new Date(room.updatedAt), 'yyyy.MM.dd HH:mm', {
            locale: ko,
          })}
        />
        <InfoRow label="최대 참여자" value={`${room.maxParticipants}명`} />
        <InfoRow
          label="게스트 허용"
          value={room.allowGuest ? '허용' : '불허'}
        />
        <InfoRow
          label="자동 상담원 배정"
          value={room.isAutoAssign ? '사용' : '미사용'}
        />
      </CardContent>
    </TabsContent>
  );
}
