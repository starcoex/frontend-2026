import { DeliveryStatus } from '@starcoex-frontend/delivery';

export {
  DELIVERY_STATUS_CONFIG,
  DELIVERY_STATUS_OPTIONS,
  DELIVERY_STATUS_TIMELINE,
  DELIVERY_PRIORITY_CONFIG,
  DRIVER_STATUS_CONFIG,
  VEHICLE_TYPE_CONFIG,
  formatDeliveryFee,
} from '@/app/pages/dashboard/ecommerce/delivery/data/delivery-data';

// ============================================================================
// 배달기사 전용 — 수락/거절 가능한 상태
// ============================================================================

/** 배달기사가 수락/거절할 수 있는 상태 */
export const DRIVER_ACCEPTABLE_STATUSES: DeliveryStatus[] = [
  'PENDING',
  'DRIVER_ASSIGNED',
];

/** 배달기사가 상태를 업데이트할 수 있는 진행 중 상태 */
export const DRIVER_ACTIVE_STATUSES: DeliveryStatus[] = [
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
];

// ============================================================================
// 배달기사 액션 버튼 설정 — 현재 상태에 따라 다음 액션 결정
// ============================================================================

export type DriverActionConfig = {
  label: string;
  nextStatus: DeliveryStatus;
  // ✅ Button variant만 허용 (warning 제거)
  variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  description: string;
};

export const DRIVER_STATUS_ACTIONS: Partial<
  Record<DeliveryStatus, DriverActionConfig>
> = {
  DRIVER_ASSIGNED: {
    label: '배송 수락',
    nextStatus: 'ACCEPTED',
    variant: 'default',
    description: '이 배송을 수락하고 픽업을 시작합니다.',
  },
  ACCEPTED: {
    label: '픽업 완료',
    nextStatus: 'PICKED_UP',
    variant: 'secondary',
    description: '물품을 픽업했습니다.',
  },
  PICKED_UP: {
    label: '배송 출발',
    nextStatus: 'IN_TRANSIT',
    variant: 'secondary',
    description: '배송을 시작합니다.',
  },
  IN_TRANSIT: {
    label: '배송 완료',
    nextStatus: 'DELIVERED',
    variant: 'default',
    description: '배송이 완료되었습니다.',
  },
};

// ============================================================================
// GPS 전송 설정
// ============================================================================

export const GPS_CONFIG = {
  /** 위치 전송 간격 (ms) */
  SEND_INTERVAL_MS: 10_000,
  /** Geolocation 옵션 */
  GEO_OPTIONS: {
    enableHighAccuracy: true,
    timeout: 10_000,
    maximumAge: 5_000,
  },
} as const;
