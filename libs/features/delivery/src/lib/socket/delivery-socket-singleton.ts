import { io, Socket } from 'socket.io-client';
import { DELIVERY_SOCKET_NAMESPACE } from '../types';

let socketInstance: Socket | null = null;

// ❌ 제거: const SOCKET_URL = 'http://localhost:4105';

/**
 * ✅ 소켓 싱글톤 반환 — 없으면 생성, 있으면 기존 것 반환
 * 참조 카운트 제거 — 단순하게 인스턴스만 관리
 */
export function getDeliverySocket(): Socket {
  if (!socketInstance) {
    // socketInstance = io(`${SOCKET_URL}${DELIVERY_SOCKET_NAMESPACE}`, {
    socketInstance = io(DELIVERY_SOCKET_NAMESPACE, {
      // ✅ 개발: Vite 프록시(/delivery/socket.io) → api.starcoex.com → delivery 서비스
      // ✅ 프로덕션: api.starcoex.com → K3s Ingress → delivery 서비스
      path: '/delivery/socket.io',
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
    });
    // 연결 디버깅
    socketInstance.on('connect', () => {
      console.info('[DeliverySocket] 연결됨:', socketInstance?.id);
    });
    socketInstance.on('disconnect', (reason) => {
      console.info('[DeliverySocket] 연결 해제:', reason);
      if (reason === 'io server disconnect') {
        console.warn('[DeliverySocket] 서버에 의한 연결 해제 — 인증 확인 필요');
      }
    });
    socketInstance.on('connect_error', (err) => {
      console.error('[DeliverySocket] 연결 오류:', err.message);
    });
  }
  return socketInstance;
}

/**
 * ✅ 소켓 연결 — 이미 연결되어 있으면 그냥 반환
 * 여러 번 호출해도 연결은 한 번만 수행
 */
export function connectDeliverySocket(): Socket {
  const socket = getDeliverySocket();
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

/**
 * ✅ 소켓 해제 — 앱 종료 시에만 호출
 * 일반적으로 컴포넌트 unmount에서는 호출하지 않음
 */
export function destroyDeliverySocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
