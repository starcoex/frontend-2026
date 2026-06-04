import { io, Socket } from 'socket.io-client';

// 백엔드: QueueGateway namespace '/queue', path '/queue/socket.io'
const QUEUE_SOCKET_NAMESPACE = '/queue';

let socketInstance: Socket | null = null;

export function getQueueSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(QUEUE_SOCKET_NAMESPACE, {
      // 개발: Vite 프록시 /queue/socket.io → localhost:1421/queue/socket.io
      // 프로덕션: Nginx 리버스 프록시 → queue-service:1421
      path: '/queue/socket.io',
      withCredentials: true,
      // ✅ polling으로 시작 후 websocket 업그레이드 (Ingress 호환성)
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
    });

    socketInstance.on('connect', () => {
      console.info('[QueueSocket] 연결됨:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.info('[QueueSocket] 연결 해제:', reason);
      if (reason === 'io server disconnect') {
        console.warn('[QueueSocket] 서버에 의한 연결 해제');
      }
    });

    socketInstance.on('connect_error', (err) => {
      console.error('[QueueSocket] 연결 오류:', err.message);
    });

    socketInstance.on('error', (data) => {
      console.error('[QueueSocket] 서버 에러:', data);
    });
  }

  return socketInstance;
}

export function connectQueueSocket(): Socket {
  const socket = getQueueSocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

export function destroyQueueSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
