// ============================================================================
// 재고 상태 옵션
// ============================================================================

export const INVENTORY_STOCK_STATUS_OPTIONS = [
  { value: 'normal', label: '정상' },
  { value: 'low-stock', label: '재고 부족' },
  { value: 'out-of-stock', label: '재고 없음' },
  { value: 'over-stock', label: '과잉 재고' },
] as const;

export type InventoryStockStatusValue =
  (typeof INVENTORY_STOCK_STATUS_OPTIONS)[number]['value'];

// ============================================================================
// 가용 여부 필터 옵션
// ============================================================================

export const INVENTORY_AVAILABLE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'available', label: '판매 가능' },
  { value: 'unavailable', label: '판매 불가' },
] as const;

export type InventoryAvailableValue =
  (typeof INVENTORY_AVAILABLE_OPTIONS)[number]['value'];

// ============================================================================
// 구역(Zone) 옵션
// ============================================================================

export const INVENTORY_ZONE_OPTIONS = [
  { value: 'FUEL', label: '주유' },
  { value: 'CONVENIENCE', label: '편의점' },
  { value: 'CAFE', label: '카페' },
  { value: 'WASH', label: '세차' },
] as const;

export type InventoryZoneValue =
  (typeof INVENTORY_ZONE_OPTIONS)[number]['value'];

// ============================================================================
// 트랜잭션 타입 옵션
// ============================================================================

export const INVENTORY_TRANSACTION_TYPE_OPTIONS = [
  { value: 'IN', label: '입고' },
  { value: 'OUT', label: '출고' },
  { value: 'RESERVE', label: '예약' },
  { value: 'RELEASE', label: '예약 해제' },
  { value: 'ADJUSTMENT', label: '조정' },
  { value: 'TRANSFER', label: '이동' },
  { value: 'RETURN', label: '반품' },
  { value: 'DAMAGE', label: '손상' },
  { value: 'EXPIRE', label: '폐기' },
] as const;

export type InventoryTransactionTypeValue =
  (typeof INVENTORY_TRANSACTION_TYPE_OPTIONS)[number]['value'];

// ============================================================================
// 트랜잭션 사유 옵션
// ============================================================================

export const INVENTORY_REASON_OPTIONS = [
  // 입고
  { value: 'PURCHASE', label: '구매 입고', group: '입고' },
  { value: 'TRANSFER_IN', label: '매장 이동 입고', group: '입고' },
  { value: 'RETURN_IN', label: '반품 입고', group: '입고' },
  { value: 'ADJUSTMENT_IN', label: '조정 입고', group: '입고' },
  // 출고
  { value: 'SALE', label: '판매 출고', group: '출고' },
  { value: 'TRANSFER_OUT', label: '매장 이동 출고', group: '출고' },
  { value: 'RETURN_OUT', label: '반품 출고', group: '출고' },
  { value: 'DAMAGE_OUT', label: '손상 출고', group: '출고' },
  { value: 'EXPIRE_OUT', label: '폐기 출고', group: '출고' },
  { value: 'ADJUSTMENT_OUT', label: '조정 출고', group: '출고' },
  // 예약
  { value: 'ORDER_RESERVE', label: '주문 예약', group: '예약' },
  { value: 'ORDER_RELEASE', label: '주문 예약 해제', group: '예약' },
  { value: 'ORDER_CONFIRM', label: '주문 확정', group: '예약' },
  // 기타
  { value: 'COUNT_ADJUSTMENT', label: '실사 조정', group: '기타' },
] as const;

export type InventoryReasonValue =
  (typeof INVENTORY_REASON_OPTIONS)[number]['value'];

// ============================================================================
// 이동 상태 옵션
// ============================================================================

export const INVENTORY_MOVEMENT_STATUS_OPTIONS = [
  { value: 'REQUESTED', label: '요청됨' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'REJECTED', label: '거부됨' },
  { value: 'SHIPPED', label: '출고됨' },
  { value: 'RECEIVED', label: '입고됨' },
  { value: 'COMPLETED', label: '완료됨' },
  { value: 'CANCELLED', label: '취소됨' },
] as const;

export type InventoryMovementStatusValue =
  (typeof INVENTORY_MOVEMENT_STATUS_OPTIONS)[number]['value'];

// ============================================================================
// 실사 타입 / 상태 옵션
// ============================================================================

export const INVENTORY_COUNT_TYPE_OPTIONS = [
  { value: 'FULL', label: '전체 실사' },
  { value: 'PARTIAL', label: '부분 실사' },
  { value: 'CYCLE', label: '순환 실사' },
  { value: 'SPOT', label: '스팟 실사' },
] as const;

export type InventoryCountTypeValue =
  (typeof INVENTORY_COUNT_TYPE_OPTIONS)[number]['value'];

export const INVENTORY_COUNT_STATUS_OPTIONS = [
  { value: 'PLANNING', label: '계획중' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'IN_PROGRESS', label: '진행중' },
  { value: 'COMPLETED', label: '완료됨' },
  { value: 'CANCELLED', label: '취소됨' },
] as const;

export type InventoryCountStatusValue =
  (typeof INVENTORY_COUNT_STATUS_OPTIONS)[number]['value'];

// ============================================================================
// 정렬 옵션
// ============================================================================

export const INVENTORY_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'currentStock_desc', label: '재고 많은순' },
  { value: 'currentStock_asc', label: '재고 적은순' },
  { value: 'availableStock_desc', label: '가용 재고 많은순' },
  { value: 'availableStock_asc', label: '가용 재고 적은순' },
] as const;

export type InventorySortValue =
  (typeof INVENTORY_SORT_OPTIONS)[number]['value'];

// ============================================================================
// 임계값 상수
// ============================================================================

export const INVENTORY_LOW_STOCK_THRESHOLD = 10;
export const INVENTORY_REORDER_DEFAULT = 50;
export const INVENTORY_MAX_STOCK_DEFAULT = 1000;
