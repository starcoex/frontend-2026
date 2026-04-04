import type {
  DeliveryStatus,
  DeliveryPriority,
  DriverStatus,
  VehicleType,
  DriverPaymentType,
  SettlementStatus,
} from '@starcoex-frontend/delivery';

// Badge variant 타입 (shadcn/ui Badge 기준)
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

// ============================================================================
// DeliveryStatus
// ============================================================================

export const DELIVERY_STATUS_CONFIG: Record<
  DeliveryStatus,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: '대기', variant: 'outline' },
  DRIVER_ASSIGNED: { label: '기사 배정', variant: 'secondary' },
  ACCEPTED: { label: '수락됨', variant: 'secondary' },
  PICKED_UP: { label: '픽업 완료', variant: 'warning' },
  IN_TRANSIT: { label: '배송 중', variant: 'warning' },
  DELIVERED: { label: '배송 완료', variant: 'success' },
  FAILED: { label: '실패', variant: 'destructive' },
  CANCELLED: { label: '취소', variant: 'destructive' },
  RETURNED: { label: '반송', variant: 'outline' },
};

export const DELIVERY_STATUS_OPTIONS = Object.entries(
  DELIVERY_STATUS_CONFIG
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// DeliveryPriority
// ============================================================================

export const DELIVERY_PRIORITY_CONFIG: Record<
  DeliveryPriority,
  { label: string; variant: BadgeVariant }
> = {
  LOW: { label: '낮음', variant: 'outline' },
  NORMAL: { label: '보통', variant: 'secondary' },
  HIGH: { label: '높음', variant: 'warning' },
  URGENT: { label: '긴급', variant: 'destructive' },
};

export const DELIVERY_PRIORITY_OPTIONS = Object.entries(
  DELIVERY_PRIORITY_CONFIG
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// DriverStatus
// ============================================================================

export const DRIVER_STATUS_CONFIG: Record<
  DriverStatus,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: '대기', variant: 'outline' },
  ACTIVE: { label: '활성', variant: 'success' },
  INACTIVE: { label: '비활성', variant: 'secondary' },
  SUSPENDED: { label: '정지', variant: 'warning' },
  TERMINATED: { label: '해지', variant: 'destructive' },
};

export const DRIVER_STATUS_OPTIONS = Object.entries(DRIVER_STATUS_CONFIG).map(
  ([value, { label }]) => ({ value, label })
);

// ============================================================================
// VehicleType
// ============================================================================

export const VEHICLE_TYPE_CONFIG: Record<VehicleType, { label: string }> = {
  BICYCLE: { label: '자전거' },
  MOTORCYCLE: { label: '오토바이' },
  CAR: { label: '자동차' },
  TRUCK: { label: '트럭' },
};

export const VEHICLE_TYPE_OPTIONS = Object.entries(VEHICLE_TYPE_CONFIG).map(
  ([value, { label }]) => ({ value, label })
);

// ============================================================================
// DriverPaymentType
// ============================================================================

export const DRIVER_PAYMENT_TYPE_CONFIG: Record<
  DriverPaymentType,
  { label: string }
> = {
  PER_DELIVERY: { label: '건당 수수료' },
  HOURLY: { label: '시급' },
  MONTHLY: { label: '월급' },
};

export const DRIVER_PAYMENT_TYPE_OPTIONS = Object.entries(
  DRIVER_PAYMENT_TYPE_CONFIG
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// SettlementStatus
// ============================================================================

export const SETTLEMENT_STATUS_CONFIG: Record<
  SettlementStatus,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: '정산 대기', variant: 'outline' },
  CALCULATED: { label: '정산 완료', variant: 'secondary' },
  APPROVED: { label: '승인됨', variant: 'warning' },
  PAID: { label: '지급 완료', variant: 'success' },
};

export const SETTLEMENT_STATUS_OPTIONS = Object.entries(
  SETTLEMENT_STATUS_CONFIG
).map(([value, { label }]) => ({ value, label }));

// ============================================================================
// 배송 타임라인 순서
// ============================================================================

export const DELIVERY_STATUS_TIMELINE: DeliveryStatus[] = [
  'PENDING',
  'DRIVER_ASSIGNED',
  'ACCEPTED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
];

// ============================================================================
// 유틸 함수
// ============================================================================

export const formatDeliveryFee = (amount: number): string =>
  `₩${amount.toLocaleString()}`;

export const formatWeight = (kg: number): string => `${kg}kg`;

export const formatEstimatedTime = (minutes: number): string =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}시간 ${minutes % 60}분`
    : `${minutes}분`;
