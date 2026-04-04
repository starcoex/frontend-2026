import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDeliveryContext } from '../context';
import { DELIVERY_SOCKET_EVENTS, DELIVERY_SOCKET_NAMESPACE } from '../types';
import type {
  DriverLocationPayload,
  DeliveryStatusChangedPayload,
  DriverAssignedPayload,
  NewDeliveryRequestPayload,
  DeliveryCancelledPayload,
  DeliveryCompletedPayload,
} from '../types';
import type { DeliveryStatus } from '../types';

interface UseDeliverySocketOptions {
  /** 인증 토큰 */
  token: string | null;
  /** 서버 URL (기본값: 현재 origin) */
  serverUrl?: string;
  /** 특정 배송 ID 구독 (배송 추적 페이지용) */
  deliveryId?: number;
  /** 드라이버 룸 구독 (관리자/기사 관리 페이지용) */
  joinDriversRoom?: boolean;
  /** 새 배송 요청 수신 콜백 */
  onNewDeliveryRequest?: (payload: NewDeliveryRequestPayload) => void;
}

export const useDeliverySocket = ({
  token,
  serverUrl,
  deliveryId,
  joinDriversRoom = false,
  onNewDeliveryRequest,
}: UseDeliverySocketOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const {
    setSocketStatus,
    setLiveLocation,
    updateDeliveryInContext,
    addSubscribedDelivery,
    removeSubscribedDelivery,
    socketStatus,
    liveLocations,
  } = useDeliveryContext();

  // ── 소켓 연결 ──────────────────────────────────────────────────────────────

  useEffect(() => {
    // 토큰 없으면 연결하지 않음
    if (!token) return;

    const url = serverUrl ?? globalThis.location?.origin ?? '';

    setSocketStatus('connecting');

    const socket = io(`${url}${DELIVERY_SOCKET_NAMESPACE}`, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    // ── 연결 이벤트 ──────────────────────────────────────────────────────────

    socket.on(DELIVERY_SOCKET_EVENTS.CONNECT, () => {
      setSocketStatus('connected');
      console.info('[DeliverySocket] 연결됨');

      // 드라이버 룸 구독 (관리자용)
      if (joinDriversRoom) {
        socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DRIVERS);
      }
    });

    socket.on(DELIVERY_SOCKET_EVENTS.DISCONNECT, (reason: string) => {
      setSocketStatus('disconnected');
      console.info('[DeliverySocket] 연결 해제:', reason);
    });

    socket.on(DELIVERY_SOCKET_EVENTS.CONNECT_ERROR, (err: Error) => {
      setSocketStatus('error');
      console.error('[DeliverySocket] 연결 오류:', err.message);
    });

    // ── 실시간 이벤트 핸들러 ─────────────────────────────────────────────────

    socket.on(
      DELIVERY_SOCKET_EVENTS.DRIVER_LOCATION_UPDATED,
      (payload: DriverLocationPayload) => {
        setLiveLocation({
          driverId: payload.driverId,
          lat: payload.location.lat,
          lng: payload.location.lng,
          accuracy: payload.location.accuracy,
          heading: payload.location.heading,
          speed: payload.location.speed,
          updatedAt: payload.location.timestamp,
        });
        // currentLocation도 Delivery에 반영
        updateDeliveryInContext(payload.deliveryId, {
          currentLocation: {
            lat: payload.location.lat,
            lng: payload.location.lng,
          },
        });
      }
    );

    socket.on(
      DELIVERY_SOCKET_EVENTS.DELIVERY_STATUS_CHANGED,
      (payload: DeliveryStatusChangedPayload) => {
        updateDeliveryInContext(payload.deliveryId, {
          status: payload.toStatus as DeliveryStatus,
        });
      }
    );

    socket.on(
      DELIVERY_SOCKET_EVENTS.DRIVER_ASSIGNED,
      (payload: DriverAssignedPayload) => {
        updateDeliveryInContext(payload.deliveryId, {
          driverId: payload.driverId,
          status: 'DRIVER_ASSIGNED',
          assignedAt: payload.assignedAt,
          estimatedTime: payload.estimatedTime ?? undefined,
        });
      }
    );

    socket.on(
      DELIVERY_SOCKET_EVENTS.DELIVERY_CANCELLED,
      (payload: DeliveryCancelledPayload) => {
        updateDeliveryInContext(payload.deliveryId, {
          status: 'CANCELLED',
          cancelledAt: payload.cancelledAt,
          cancelReason: payload.reason ?? undefined,
        });
      }
    );

    socket.on(
      DELIVERY_SOCKET_EVENTS.DELIVERY_COMPLETED,
      (payload: DeliveryCompletedPayload) => {
        updateDeliveryInContext(payload.deliveryId, {
          status: 'DELIVERED',
          deliveredAt: payload.deliveredAt,
        });
      }
    );

    socket.on(
      DELIVERY_SOCKET_EVENTS.NEW_DELIVERY_REQUEST,
      (payload: NewDeliveryRequestPayload) => {
        onNewDeliveryRequest?.(payload);
      }
    );

    return () => {
      if (joinDriversRoom) {
        socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DRIVERS);
      }
      socket.disconnect();
      socketRef.current = null;
      setSocketStatus('disconnected');
    };
  }, [token, serverUrl, joinDriversRoom]);

  // ── 특정 배송 구독/해제 ────────────────────────────────────────────────────

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !deliveryId) return;

    socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DELIVERY, { deliveryId });
    addSubscribedDelivery(deliveryId);

    return () => {
      socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DELIVERY, { deliveryId });
      removeSubscribedDelivery(deliveryId);
    };
  }, [deliveryId]);

  // ── 외부에서 수동으로 배송 구독/해제 ─────────────────────────────────────

  const subscribeDelivery = useCallback(
    (id: number) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DELIVERY, { deliveryId: id });
      addSubscribedDelivery(id);
    },
    [addSubscribedDelivery]
  );

  const unsubscribeDelivery = useCallback(
    (id: number) => {
      const socket = socketRef.current;
      if (!socket) return;
      socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DELIVERY, { deliveryId: id });
      removeSubscribedDelivery(id);
    },
    [removeSubscribedDelivery]
  );

  return {
    socketStatus,
    liveLocations,
    subscribeDelivery,
    unsubscribeDelivery,
    isConnected: socketStatus === 'connected',
  };
};
