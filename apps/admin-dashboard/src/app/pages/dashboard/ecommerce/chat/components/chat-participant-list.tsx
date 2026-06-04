import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ChatParticipant } from '@starcoex-frontend/chats';

const ROLE_LABEL: Record<string, string> = {
  GUEST: '게스트',
  CUSTOMER: '고객',
  SUPPORT_AGENT: '상담원',
  SUPERVISOR: '관리자',
  SYSTEM: '시스템',
  BOT: '봇',
};

const ROLE_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'success'
> = {
  GUEST: 'outline',
  CUSTOMER: 'secondary',
  SUPPORT_AGENT: 'default',
  SUPERVISOR: 'success',
  SYSTEM: 'outline',
  BOT: 'outline',
};

interface ChatParticipantListProps {
  participants: ChatParticipant[];
}

export function ChatParticipantList({
  participants,
}: ChatParticipantListProps) {
  if (participants.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        참여자가 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y py-2">
      {participants.map((p) => (
        <div key={p.id} className="flex items-center justify-between py-3">
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {p.displayName ?? `참여자 #${p.id}`}
              </span>
              {p.isOnline && (
                <span className="size-2 rounded-full bg-green-500" />
              )}
            </div>
            {p.lastSeenAt && (
              <p className="text-muted-foreground text-xs">
                마지막 접속:{' '}
                {format(new Date(p.lastSeenAt), 'MM/dd HH:mm', { locale: ko })}
              </p>
            )}
            {p.leftAt && (
              <p className="text-muted-foreground text-xs">
                퇴장:{' '}
                {format(new Date(p.leftAt), 'MM/dd HH:mm', { locale: ko })}
              </p>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Badge variant={ROLE_VARIANT[p.role] as any} className="text-xs">
              {ROLE_LABEL[p.role] ?? p.role}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
