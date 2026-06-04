import { Loader2, UserPlus } from 'lucide-react';
import React from 'react';

export interface ChatJoinBannerProps {
  type: 'join' | 'rejoin';
  isLoading: boolean;
  onJoin: () => void;
  ButtonComponent: React.ComponentType<
    React.ButtonHTMLAttributes<HTMLButtonElement> & { size?: string }
  >;
}

export function ChatJoinBanner({
  type,
  isLoading,
  onJoin,
  ButtonComponent,
}: ChatJoinBannerProps) {
  const isRejoin = type === 'rejoin';

  return (
    <div
      className={`flex-shrink-0 border-t px-4 py-3 ${
        isRejoin
          ? 'bg-blue-50 dark:bg-blue-950/20'
          : 'bg-yellow-50 dark:bg-yellow-950/20'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <p
          className={`text-sm ${
            isRejoin
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-yellow-700 dark:text-yellow-400'
          }`}
        >
          {isRejoin
            ? '이전에 나간 채팅방입니다. 다시 참여할 수 있습니다.'
            : '메시지를 보내려면 채팅방에 참여해야 합니다.'}
        </p>
        <ButtonComponent
          size="sm"
          onClick={onJoin}
          disabled={isLoading}
          className="flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 size-4" />
          )}
          {isRejoin ? '재참여' : '참여하기'}
        </ButtonComponent>
      </div>
    </div>
  );
}
