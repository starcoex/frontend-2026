// ─── 주문 상태 ────────────────────────────────────────────────────────────────
import { FulfillmentType } from '@starcoex-frontend/graphql';

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: '주문 접수', variant: 'secondary' },
  { value: 'CONFIRMED', label: '주문 확인', variant: 'default' },
  { value: 'PREPARING', label: '상품 준비중', variant: 'warning' },
  { value: 'SHIPPED', label: '배송 시작', variant: 'default' },
  { value: 'DELIVERED', label: '배송 완료', variant: 'success' },
  { value: 'CANCELLED', label: '주문 취소', variant: 'destructive' },
  { value: 'REFUNDED', label: '환불 완료', variant: 'outline' },
  { value: 'RETURNED', label: '반품 완료', variant: 'outline' },
] as const;

export const FULFILLMENT_TYPE_LABELS: Record<FulfillmentType, string> = {
  DELIVERY: '🚚 배송',
  PICKUP: '🏪 픽업',
  ON_SITE: '⛽ 현장',
};

export type OrderStatusValue = (typeof ORDER_STATUS_OPTIONS)[number]['value'];

// ─── 결제 상태 ────────────────────────────────────────────────────────────────
export const ORDER_PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: '결제 대기', variant: 'secondary' },
  { value: 'COMPLETED', label: '결제 완료', variant: 'success' },
  { value: 'FAILED', label: '결제 실패', variant: 'destructive' },
  { value: 'CANCELLED', label: '결제 취소', variant: 'outline' },
  { value: 'REFUNDED', label: '환불', variant: 'outline' },
] as const;

export type OrderPaymentStatusValue =
  (typeof ORDER_PAYMENT_STATUS_OPTIONS)[number]['value'];

// ─── 처리 방식 ────────────────────────────────────────────────────────────────
export const ORDER_FULFILLMENT_OPTIONS = [
  { value: 'DELIVERY', label: '배송' },
  { value: 'PICKUP', label: '픽업' },
  { value: 'ON_SITE', label: '현장' },
] as const;

export type OrderFulfillmentValue =
  (typeof ORDER_FULFILLMENT_OPTIONS)[number]['value'];

// ─── 정렬 ────────────────────────────────────────────────────────────────────
export const ORDER_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'finalAmount_desc', label: '금액 높은순' },
  { value: 'finalAmount_asc', label: '금액 낮은순' },
] as const;

export type OrderSortValue = (typeof ORDER_SORT_OPTIONS)[number]['value'];

// ─── 탭 필터 ─────────────────────────────────────────────────────────────────
export const ORDER_TAB_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'PENDING', label: '주문 접수' },
  { value: 'CONFIRMED', label: '주문 확인' },
  { value: 'PREPARING', label: '준비중' },
  { value: 'SHIPPED', label: '배송중' },
  { value: 'DELIVERED', label: '배송완료' },
  { value: 'CANCELLED', label: '취소' },
] as const;

export type OrderTabValue = (typeof ORDER_TAB_OPTIONS)[number]['value'];

// ─── 상태 전이 맵 ─────────────────────────────────────────────────────────────
export const NEXT_STATUS_MAP: Record<OrderStatusValue, OrderStatusValue[]> = {
  PENDING: ['CONFIRMED', 'PREPARING', 'SHIPPED', 'CANCELLED'], // ✅ 스킵 허용
  CONFIRMED: ['PREPARING', 'SHIPPED', 'CANCELLED'], // ✅ 스킵 허용
  PREPARING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['REFUNDED', 'RETURNED'],
  CANCELLED: ['REFUNDED'], // ✅ 취소 후 환불 가능
  REFUNDED: [],
  RETURNED: [],
};
