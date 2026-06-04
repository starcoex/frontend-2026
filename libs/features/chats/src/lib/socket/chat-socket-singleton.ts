import { io, Socket } from 'socket.io-client';
import { CHAT_SOCKET_NAMESPACE } from '../types';

let socketInstance: Socket | null = null;

// ✅ 백엔드 chat-gateway.ts 가 /socket.io (기본 path) 사용
// 개발/프로덕션 모두 직접 포트 연결 — CORS origin: '*' 허용됨
// const CHAT_SOCKET_URL = 'http://localhost:4104';

export function getChatSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(CHAT_SOCKET_NAMESPACE, {
      // ✅ 개발/프로덕션 모두 /chat/socket.io 경로 사용
      // - 개발: Vite 프록시 → localhost:4104/socket.io
      // - 프로덕션: Nginx 등 리버스 프록시 → chat-service:4104/socket.io
      path: '/chat/socket.io',
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
    });

    // 연결 디버깅
    socketInstance.on('connect', () => {
      console.info('[ChatSocket] 연결됨:', socketInstance?.id);
    });
    socketInstance.on('disconnect', (reason) => {
      console.info('[ChatSocket] 연결 해제:', reason);
      // ✅ 서버가 인증 실패로 끊은 경우
      if (reason === 'io server disconnect') {
        console.warn('[ChatSocket] 서버에 의한 연결 해제 — 인증 확인 필요');
      }
    });
    socketInstance.on('connect_error', (err) => {
      console.error('[ChatSocket] 연결 오류:', err.message);
    });
    socketInstance.on('error', (data) => {
      console.error('[ChatSocket] 서버 에러:', data);
    });
  }
  return socketInstance;
}

export function connectChatSocket(): Socket {
  const socket = getChatSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function destroyChatSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
