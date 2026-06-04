import { useEffect, useCallback, useState } from 'react';
import { connectChatSocket } from '../socket';
import {
  CHAT_SOCKET_EVENTS,
  type UserTypingPayload,
  type MessageReadPayload,
  type OnlineCountPayload,
  type ChatSocketStatus,
} from '../types';

interface UseChatSocketOptions {
  /** 입장할 채팅방 ID */
  roomId: number | null;
  /** 타이핑 수신 콜백 */
  onUserTyping?: (payload: UserTypingPayload) => void;
  /** 읽음 수신 콜백 */
  onMessageRead?: (payload: MessageReadPayload) => void;
  /** 소켓 비활성화 */
  enabled?: boolean;
}

export const useChatSocket = ({
  roomId,
  onUserTyping,
  onMessageRead,
  enabled = true,
}: UseChatSocketOptions) => {
  const [socketStatus, setSocketStatus] =
    useState<ChatSocketStatus>('disconnected');
  const [onlineCount, setOnlineCount] = useState<number>(0);

  // ── 소켓 연결 + 룸 입장 + 이벤트 등록 ────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !roomId) return;

    const socket = connectChatSocket();
    setSocketStatus(socket.connected ? 'connected' : 'connecting');

    const onConnect = () => {
      setSocketStatus('connected');
      // 연결 후 채팅방 입장
      socket.emit(CHAT_SOCKET_EVENTS.JOIN_ROOM, {
        chatRoomId: String(roomId),
      });
      // 온라인 수 요청
      socket.emit(CHAT_SOCKET_EVENTS.GET_ONLINE_COUNT, {
        chatRoomId: String(roomId),
      });
    };

    const onDisconnect = (reason: string) => {
      if (reason !== 'io client disconnect') {
        setSocketStatus('disconnected');
      }
    };

    const onConnectError = () => {
      setSocketStatus('error');
    };

    const onUserTypingHandler = (payload: UserTypingPayload) => {
      if (payload.chatRoomId !== String(roomId)) return;
      onUserTyping?.(payload);
    };

    const onMessageReadHandler = (payload: MessageReadPayload) => {
      if (payload.chatRoomId !== String(roomId)) return;
      onMessageRead?.(payload);
    };

    const onOnlineCountHandler = (payload: OnlineCountPayload) => {
      if (payload.chatRoomId !== String(roomId)) return;
      setOnlineCount(payload.count);
    };

    // 이미 connected면 수동 호출
    if (socket.connected) {
      onConnect();
    }

    socket.on(CHAT_SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(CHAT_SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socket.on(CHAT_SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
    socket.on(CHAT_SOCKET_EVENTS.USER_TYPING, onUserTypingHandler);
    socket.on(CHAT_SOCKET_EVENTS.MESSAGE_READ, onMessageReadHandler);
    socket.on(CHAT_SOCKET_EVENTS.ONLINE_COUNT, onOnlineCountHandler);

    return () => {
      // 룸 퇴장 (소켓 연결 유지)
      socket.emit(CHAT_SOCKET_EVENTS.LEAVE_ROOM, {
        chatRoomId: String(roomId),
      });
      socket.off(CHAT_SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(CHAT_SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socket.off(CHAT_SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
      socket.off(CHAT_SOCKET_EVENTS.USER_TYPING, onUserTypingHandler);
      socket.off(CHAT_SOCKET_EVENTS.MESSAGE_READ, onMessageReadHandler);
      socket.off(CHAT_SOCKET_EVENTS.ONLINE_COUNT, onOnlineCountHandler);
    };
  }, [roomId, enabled]);

  // ── 타이핑 상태 전송 ──────────────────────────────────────────────────────────
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!roomId || !enabled) return;
      const socket = connectChatSocket();
      socket.emit(CHAT_SOCKET_EVENTS.TYPING, {
        chatRoomId: String(roomId),
        isTyping,
      });
    },
    [roomId, enabled]
  );

  // ── 읽음 상태 전송 ────────────────────────────────────────────────────────────
  const sendMarkAsRead = useCallback(
    (messageIds: number[]) => {
      if (!roomId || !enabled || messageIds.length === 0) return;
      const socket = connectChatSocket();
      socket.emit(CHAT_SOCKET_EVENTS.MARK_AS_READ, {
        chatRoomId: String(roomId),
        messageIds,
      });
    },
    [roomId, enabled]
  );

  return {
    socketStatus,
    onlineCount,
    isSocketConnected: socketStatus === 'connected',
    sendTyping,
    sendMarkAsRead,
  };
};
