import type { LiveDriverLocation } from './delivery.types';

// ============================================================================
// Socket 이벤트 이름 상수
// ============================================================================

export const DELIVERY_SOCKET_EVENTS = {
  // ── Client → Server (emit) ─────────────────────────────────────────────
  JOIN_DELIVERY: 'join:delivery',
  LEAVE_DELIVERY: 'leave:delivery',
  JOIN_DRIVERS: 'join:drivers',
  LEAVE_DRIVERS: 'leave:drivers',

  // ── Server → Client (on) ──────────────────────────────────────────────
  DRIVER_LOCATION_UPDATED: 'driver:location_updated',
  DELIVERY_STATUS_CHANGED: 'delivery:status_changed',
  DRIVER_ASSIGNED: 'delivery:driver_assigned',
  NEW_DELIVERY_REQUEST: 'delivery:new_request',
  DELIVERY_CANCELLED: 'delivery:cancelled',
  DELIVERY_COMPLETED: 'delivery:completed',

  // ── 연결 상태 ──────────────────────────────────────────────────────────
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

export type DeliverySocketEvent =
  (typeof DELIVERY_SOCKET_EVENTS)[keyof typeof DELIVERY_SOCKET_EVENTS];

// ============================================================================
// Socket 네임스페이스
// ============================================================================

export const DELIVERY_SOCKET_NAMESPACE = '/delivery-tracking';

// ============================================================================
// Server → Client 이벤트 페이로드 타입
// ============================================================================

export interface DriverLocationPayload {
  driverId: number;
  deliveryId: number;
  location: {
    lat: number;
    lng: number;
    accuracy?: number;
    heading?: number;
    speed?: number;
    timestamp: string;
  };
}

export interface DeliveryStatusChangedPayload {
  deliveryId: number;
  deliveryNumber: string;
  fromStatus: string;
  toStatus: string;
  changedAt: string;
  driverId?: number | null;
}

export interface DriverAssignedPayload {
  deliveryId: number;
  deliveryNumber: string;
  driverId: number;
  driverName: string;
  driverPhone: string;
  vehicleType: string;
  vehicleNumber?: string | null;
  estimatedTime?: number | null;
  assignedAt: string;
}

export interface NewDeliveryRequestPayload {
  deliveryId: number;
  deliveryNumber: string;
  storeId: number;
  priority: string;
  itemCount: number;
  deliveryFee: number;
  deliveryAddress: Record<string, unknown>;
  requestedAt: string;
  /** 카카오모빌리티 API로 계산된 배송 거리 (km) */
  deliveryDistance?: number | null;
  /** 카카오모빌리티 API로 계산된 예상 소요시간 (분) */
  estimatedTime?: number | null;
}

export interface DeliveryCancelledPayload {
  deliveryId: number;
  deliveryNumber: string;
  reason?: string | null;
  cancelledAt: string;
}

export interface DeliveryCompletedPayload {
  deliveryId: number;
  deliveryNumber: string;
  driverId: number;
  deliveredAt: string;
}

// ============================================================================
// Client → Server 이벤트 페이로드 타입
// ============================================================================

export interface JoinDeliveryPayload {
  deliveryId: number;
}

export interface LeaveDeliveryPayload {
  deliveryId: number;
}

// ============================================================================
// 소켓 연결 상태 타입
// ============================================================================

export type SocketConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

// ✅ delivery.types.ts 에서 re-export (중복 선언 제거)
export type { LiveDriverLocation };
