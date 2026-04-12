import { useEffect, useCallback } from 'react';
import { connectDeliverySocket } from '../socket';
import { useDeliveryContext } from '../context';
import { DELIVERY_SOCKET_EVENTS } from '../types';
import type {
  DriverLocationPayload,
  DeliveryStatusChangedPayload,
  DriverAssignedPayload,
  NewDeliveryRequestPayload,
  DeliveryCancelledPayload,
  DeliveryCompletedPayload,
} from '../types';
import type { DeliveryStatus, VehicleType } from '../types';

interface UseDeliverySocketOptions {
  token?: string | null;
  serverUrl?: string;
  deliveryId?: number;
  joinDriversRoom?: boolean;
  onNewDeliveryRequest?: (payload: NewDeliveryRequestPayload) => void;
  enabled?: boolean;
}

export const useDeliverySocket = ({
  deliveryId,
  joinDriversRoom = false,
  onNewDeliveryRequest,
  enabled = true,
}: UseDeliverySocketOptions) => {
  const {
    setSocketStatus,
    setLiveLocation,
    updateDeliveryInContext,
    addSubscribedDelivery,
    removeSubscribedDelivery,
    socketStatus,
    liveLocations,
  } = useDeliveryContext();

  // ── 싱글톤 소켓 이벤트 등록 ────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) {
      setSocketStatus('disconnected');
      return;
    }

    const socket = connectDeliverySocket();
    setSocketStatus(socket.connected ? 'connected' : 'connecting');

    const onConnect = () => {
      setSocketStatus('connected');
      if (joinDriversRoom) {
        socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DRIVERS);
        console.info('[DeliverySocket] drivers 룸 구독 요청');
      }
    };

    const onDisconnect = (reason: string) => {
      if (reason !== 'io client disconnect') {
        setSocketStatus('disconnected');
        console.info('[DeliverySocket] 연결 해제:', reason);
      }
    };

    const onConnectError = (err: Error) => {
      setSocketStatus('error');
      console.error('[DeliverySocket] 연결 오류:', err.message);
    };

    const onDriverLocationUpdated = (payload: DriverLocationPayload) => {
      const resolvedDriverId = payload.driverId ?? payload.deliveryId;
      setLiveLocation({
        driverId: resolvedDriverId,
        lat: payload.location.lat,
        lng: payload.location.lng,
        accuracy: payload.location.accuracy,
        heading: payload.location.heading,
        speed: payload.location.speed,
        updatedAt: payload.location.timestamp,
      });
      updateDeliveryInContext(payload.deliveryId, {
        currentLocation: {
          lat: payload.location.lat,
          lng: payload.location.lng,
        },
        ...(payload.driverId ? { driverId: payload.driverId } : {}),
      });
    };

    const onDeliveryStatusChanged = (payload: DeliveryStatusChangedPayload) => {
      console.info('[DeliverySocket] 상태 변경 수신:', payload);
      updateDeliveryInContext(payload.deliveryId, {
        status: payload.toStatus as DeliveryStatus,
      });
    };

    const onDriverAssigned = (payload: DriverAssignedPayload) => {
      console.info('[DeliverySocket] 기사 배정 수신:', payload);
      updateDeliveryInContext(payload.deliveryId, {
        driverId: payload.driverId,
        status: 'DRIVER_ASSIGNED',
        assignedAt: payload.assignedAt,
        estimatedTime: payload.estimatedTime ?? undefined,
        driver: {
          id: payload.driverId,
          name: payload.driverName,
          phone: payload.driverPhone,
          vehicleType: payload.vehicleType as VehicleType,
          vehicleNumber: payload.vehicleNumber ?? null,
          status: 'ACTIVE' as const,
          isAvailable: false,
          driverCode: '',
          userId: 0,
          createdAt: payload.assignedAt,
          updatedAt: payload.assignedAt,
          createdById: 0,
          updatedById: 0,
          totalDeliveries: 0,
          maxConcurrentOrders: 1,
          paymentType: 'PER_DELIVERY' as const,
          workingAreas: {},
          deliveries: [],
          settlements: [],
          ratings: [],
        },
      });
    };

    const onDeliveryCancelled = (payload: DeliveryCancelledPayload) => {
      updateDeliveryInContext(payload.deliveryId, {
        status: 'CANCELLED',
        cancelledAt: payload.cancelledAt,
        cancelReason: payload.reason ?? undefined,
      });
    };

    const onDeliveryCompleted = (payload: DeliveryCompletedPayload) => {
      updateDeliveryInContext(payload.deliveryId, {
        status: 'DELIVERED',
        deliveredAt: payload.deliveredAt,
      });
    };

    const onNewDeliveryRequestHandler = (
      payload: NewDeliveryRequestPayload
    ) => {
      onNewDeliveryRequest?.(payload);
    };

    // 이미 connected면 onConnect 수동 호출
    if (socket.connected) {
      onConnect();
    }

    socket.on(DELIVERY_SOCKET_EVENTS.CONNECT, onConnect);
    socket.on(DELIVERY_SOCKET_EVENTS.DISCONNECT, onDisconnect);
    socket.on(DELIVERY_SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
    socket.on(
      DELIVERY_SOCKET_EVENTS.DRIVER_LOCATION_UPDATED,
      onDriverLocationUpdated
    );
    socket.on(
      DELIVERY_SOCKET_EVENTS.DELIVERY_STATUS_CHANGED,
      onDeliveryStatusChanged
    );
    socket.on(DELIVERY_SOCKET_EVENTS.DRIVER_ASSIGNED, onDriverAssigned);
    socket.on(DELIVERY_SOCKET_EVENTS.DELIVERY_CANCELLED, onDeliveryCancelled);
    socket.on(DELIVERY_SOCKET_EVENTS.DELIVERY_COMPLETED, onDeliveryCompleted);
    socket.on(
      DELIVERY_SOCKET_EVENTS.NEW_DELIVERY_REQUEST,
      onNewDeliveryRequestHandler
    );

    return () => {
      // ✅ 이벤트 리스너만 제거 — 소켓 연결은 유지
      if (joinDriversRoom) {
        socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DRIVERS);
      }
      socket.off(DELIVERY_SOCKET_EVENTS.CONNECT, onConnect);
      socket.off(DELIVERY_SOCKET_EVENTS.DISCONNECT, onDisconnect);
      socket.off(DELIVERY_SOCKET_EVENTS.CONNECT_ERROR, onConnectError);
      socket.off(
        DELIVERY_SOCKET_EVENTS.DRIVER_LOCATION_UPDATED,
        onDriverLocationUpdated
      );
      socket.off(
        DELIVERY_SOCKET_EVENTS.DELIVERY_STATUS_CHANGED,
        onDeliveryStatusChanged
      );
      socket.off(DELIVERY_SOCKET_EVENTS.DRIVER_ASSIGNED, onDriverAssigned);
      socket.off(
        DELIVERY_SOCKET_EVENTS.DELIVERY_CANCELLED,
        onDeliveryCancelled
      );
      socket.off(
        DELIVERY_SOCKET_EVENTS.DELIVERY_COMPLETED,
        onDeliveryCompleted
      );
      socket.off(
        DELIVERY_SOCKET_EVENTS.NEW_DELIVERY_REQUEST,
        onNewDeliveryRequestHandler
      );
      // ✅ disconnectDeliverySocket 호출 완전 제거
    };
  }, [joinDriversRoom, enabled]);

  // ── 특정 배송 구독/해제 ────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled || !deliveryId) return;

    // ✅ connectDeliverySocket — 이미 연결된 소켓 반환, 새 연결 없음
    const socket = connectDeliverySocket();
    socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DELIVERY, { deliveryId });
    addSubscribedDelivery(deliveryId);

    return () => {
      socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DELIVERY, { deliveryId });
      removeSubscribedDelivery(deliveryId);
      // ✅ disconnectDeliverySocket 호출 제거
    };
  }, [deliveryId, enabled]);

  const subscribeDelivery = useCallback(
    (id: number) => {
      if (!enabled) return;
      const socket = connectDeliverySocket();
      socket.emit(DELIVERY_SOCKET_EVENTS.JOIN_DELIVERY, { deliveryId: id });
      addSubscribedDelivery(id);
    },
    [addSubscribedDelivery, enabled]
  );

  const unsubscribeDelivery = useCallback(
    (id: number) => {
      if (!enabled) return;
      const socket = connectDeliverySocket();
      socket.emit(DELIVERY_SOCKET_EVENTS.LEAVE_DELIVERY, { deliveryId: id });
      removeSubscribedDelivery(id);
    },
    [removeSubscribedDelivery, enabled]
  );

  return {
    socketStatus,
    liveLocations,
    subscribeDelivery,
    unsubscribeDelivery,
    isConnected: socketStatus === 'connected',
  };
};
