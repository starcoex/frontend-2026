import { useEffect, useRef } from 'react';
import { useChatContext } from '../context';
import {
  getApolloClient, // ✅ getChatApolloClient → getApolloClient로 변경
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_DELETED_SUBSCRIPTION,
} from '@starcoex-frontend/graphql';
import type { ChatMessage } from '../types';

interface UseChatSubscriptionOptions {
  roomId: number | null;
  enabled?: boolean;
}

export const useChatSubscription = ({
  roomId,
  enabled = true,
}: UseChatSubscriptionOptions) => {
  const { addMessage, removeMessage, messagesByRoom } = useChatContext();
  const addedSubRef = useRef<{ unsubscribe: () => void } | null>(null);
  const deletedSubRef = useRef<{ unsubscribe: () => void } | null>(null);
  // ✅ 최신 messagesByRoom 참조 (클로저 stale 방지)
  const messagesByRoomRef = useRef(messagesByRoom);
  messagesByRoomRef.current = messagesByRoom;

  useEffect(() => {
    addedSubRef.current?.unsubscribe();
    deletedSubRef.current?.unsubscribe();
    addedSubRef.current = null;
    deletedSubRef.current = null;

    if (!enabled || !roomId) return;

    const client = getApolloClient(); // ✅ getChatApolloClient() → getApolloClient()

    // const client = getChatApolloClient();

    addedSubRef.current = client
      .subscribe<{ messageAdded: ChatMessage }>({
        query: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { roomId },
      })
      .subscribe({
        next({ data }) {
          if (data?.messageAdded) {
            const msg = data.messageAdded;
            // ✅ 중복 메시지 방지: 이미 캐시에 있으면 무시
            const cached = messagesByRoomRef.current[msg.roomId] ?? [];
            if (cached.some((m) => m.id === msg.id)) return;
            addMessage(msg);
          }
        },
        error(err) {
          console.error('[ChatSubscription] messageAdded 오류:', err);
        },
      });

    deletedSubRef.current = client
      .subscribe<{ messageDeleted: number }>({
        query: MESSAGE_DELETED_SUBSCRIPTION,
        variables: { roomId },
      })
      .subscribe({
        next({ data }) {
          if (data?.messageDeleted != null) {
            removeMessage(data.messageDeleted);
          }
        },
        error(err) {
          console.error('[ChatSubscription] messageDeleted 오류:', err);
        },
      });

    return () => {
      addedSubRef.current?.unsubscribe();
      deletedSubRef.current?.unsubscribe();
      addedSubRef.current = null;
      deletedSubRef.current = null;
    };
  }, [roomId, enabled]); // addMessage, removeMessage 의존성 제거 유지
};
