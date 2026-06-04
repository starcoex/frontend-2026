export const CHAT_SOCKET_NAMESPACE = '/chat';
export const CHAT_SOCKET_URL = 'http://localhost:4104';

// ── 백엔드 chat-gateway.ts 이벤트명과 정확히 일치 ────────────────────────────
export const CHAT_SOCKET_EVENTS = {
  // Client → Server
  JOIN_ROOM: 'joinRoom', // 채팅방 입장
  LEAVE_ROOM: 'leaveRoom', // 채팅방 퇴장
  TYPING: 'typing', // 타이핑 상태 전송
  MARK_AS_READ: 'markAsRead', // 읽음 처리
  GET_ONLINE_COUNT: 'getOnlineCount',

  // Server → Client
  JOINED_ROOM: 'joinedRoom',
  LEFT_ROOM: 'leftRoom',
  USER_JOINED: 'userJoined',
  USER_LEFT: 'userLeft',
  NEW_MESSAGE: 'newMessage', // 메시지 수신 (Subscription 백업)
  MESSAGE_DELETED: 'messageDeleted',
  USER_TYPING: 'userTyping', // 타이핑 수신 ✅
  MESSAGE_READ: 'messageRead', // 읽음 수신 ✅
  ONLINE_COUNT: 'onlineCount',
  ERROR: 'error',

  // 연결
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

// ── 페이로드 타입 ──────────────────────────────────────────────────────────────

export interface TypingPayload {
  chatRoomId: string;
  isTyping: boolean;
}

export interface UserTypingPayload {
  userId: string;
  chatRoomId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface MessageReadPayload {
  userId: string;
  chatRoomId: string;
  messageIds: number[];
  timestamp: Date;
}

export interface OnlineCountPayload {
  chatRoomId: string;
  count: number;
  timestamp: Date;
}

export type ChatSocketStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';
