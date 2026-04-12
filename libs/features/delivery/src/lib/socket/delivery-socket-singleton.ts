import { io, Socket } from 'socket.io-client';
import { DELIVERY_SOCKET_NAMESPACE } from '../types';

let socketInstance: Socket | null = null;

const SOCKET_URL = 'http://localhost:4105';

/**
 * ✅ 소켓 싱글톤 반환 — 없으면 생성, 있으면 기존 것 반환
 * 참조 카운트 제거 — 단순하게 인스턴스만 관리
 */
export function getDeliverySocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(`${SOCKET_URL}${DELIVERY_SOCKET_NAMESPACE}`, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: false,
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
