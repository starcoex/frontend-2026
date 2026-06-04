import { cn } from '../../../utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FileIcon, CheckCheck, Check } from 'lucide-react';
import type { ChatMessage, ChatParticipant } from '@starcoex-frontend/chats';

const ROLE_LABEL: Record<string, string> = {
  GUEST: '게스트',
  CUSTOMER: '고객',
  SUPPORT_AGENT: '상담원',
  SUPERVISOR: '관리자',
  SYSTEM: '시스템',
  BOT: '봇',
};

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  participants: ChatParticipant[];
  currentUserId?: number;
  currentUserName?: string;
  /** userId → 실명 매핑 (상대방 이름 표시용) */
  userNameMap?: Record<number, string>;
  renderFileAction?: (message: ChatMessage) => React.ReactNode;
}

export function ChatMessageBubble({
  message,
  participants,
  currentUserId,
  currentUserName,
  userNameMap,
  renderFileAction,
}: ChatMessageBubbleProps) {
  if (message.isDeleted) {
    return (
      <div className="flex justify-center">
        <span className="text-muted-foreground rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
          삭제된 메시지입니다.
        </span>
      </div>
    );
  }

  if (message.type === 'SYSTEM' || message.type === 'AUTO_REPLY') {
    return (
      <div className="flex justify-center">
        <span className="text-muted-foreground rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-800">
          {message.content}
        </span>
      </div>
    );
  }
  console.log('userNameMap: ', userNameMap);

  // ✅ message.senderId = participant.userId (DB 확인 완료)
  const sender = participants.find((p) => p.userId === message.senderId);
  const isMe =
    currentUserId != null &&
    // ✅ sender가 없어도 senderId로 직접 비교
    (sender != null
      ? sender.userId === currentUserId
      : message.senderId === currentUserId);

  const senderName = isMe
    ? currentUserName ?? sender?.displayName ?? '나'
    : // ✅ sender 유무와 관계없이 userNameMap을 먼저 확인
      userNameMap?.[message.senderId] ??
      sender?.displayName ??
      (sender
        ? ROLE_LABEL[sender.role] ?? sender.role
        : `참여자 #${message.senderId}`);

  const isRead = message.readBy.length > 1;

  return (
    <div
      className={cn(
        'flex w-full flex-col gap-1',
        isMe ? 'items-end' : 'items-start'
      )}
    >
      {!isMe && (
        <span className="text-muted-foreground px-1 text-xs font-medium">
          {senderName}
        </span>
      )}

      <div
        className={cn('flex max-w-[75%] items-end gap-1.5', {
          'flex-row-reverse': isMe,
        })}
      >
        <div
          className={cn('rounded-2xl px-3 py-2 text-sm', {
            'bg-primary text-primary-foreground rounded-tr-sm': isMe,
            'bg-muted border rounded-tl-sm': !isMe,
          })}
        >
          {(message.type === 'TEXT' || message.type === 'QUICK_REPLY') && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          {message.type === 'IMAGE' && message.imageUrl && (
            <div className="space-y-1">
              <img
                src={message.imageUrl}
                alt="이미지"
                className="max-w-[200px] rounded-lg object-cover"
              />
              {message.content && (
                <p className="text-xs opacity-80">{message.content}</p>
              )}
            </div>
          )}

          {message.type === 'FILE' && (
            <div className="flex items-center gap-2">
              <FileIcon className="size-5 flex-shrink-0 opacity-60" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {message.fileName ?? '파일'}
                </p>
                {message.fileSize && (
                  <p className="text-xs opacity-70">
                    {(message.fileSize / 1024).toFixed(1)}KB
                  </p>
                )}
              </div>
              {renderFileAction
                ? renderFileAction(message)
                : message.fileUrl && (
                    <a
                      href={message.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-shrink-0 text-xs underline opacity-70"
                    >
                      다운로드
                    </a>
                  )}
            </div>
          )}

          {message.isEdited && (
            <span className="mt-1 block text-xs opacity-60">(수정됨)</span>
          )}
        </div>

        <div
          className={cn('flex flex-shrink-0 flex-col gap-0.5', {
            'items-end': isMe,
            'items-start': !isMe,
          })}
        >
          <time className="text-muted-foreground text-xs">
            {format(new Date(message.createdAt), 'HH:mm', { locale: ko })}
          </time>
          {isMe && (
            <span>
              {isRead ? (
                <CheckCheck className="size-3 text-blue-500" />
              ) : (
                <Check className="size-3 text-muted-foreground" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
