import type {
  PromotionStatus,
  PromotionType,
  DiscountType,
  PromotionTarget,
} from '@starcoex-frontend/promotions';

export const PROMOTION_STATUS_OPTIONS: {
  value: PromotionStatus | 'ALL';
  label: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
}[] = [
  { value: 'ALL', label: '전체', variant: 'outline' },
  { value: 'DRAFT', label: '초안', variant: 'outline' },
  { value: 'PENDING_APPROVAL', label: '승인 대기', variant: 'secondary' },
  { value: 'APPROVED', label: '승인됨', variant: 'secondary' },
  { value: 'ACTIVE', label: '활성', variant: 'default' },
  { value: 'PAUSED', label: '일시 정지', variant: 'secondary' },
  { value: 'ENDED', label: '종료됨', variant: 'outline' },
  { value: 'CANCELLED', label: '취소됨', variant: 'destructive' },
] as const;

export const PROMOTION_TYPE_OPTIONS: { value: PromotionType; label: string }[] =
  [
    { value: 'COUPON', label: '쿠폰' },
    { value: 'DISCOUNT', label: '할인' },
    { value: 'BOGO', label: 'BOGO (1+1)' },
    { value: 'FREE_SHIPPING', label: '무료 배송' },
    { value: 'POINT_MULTIPLIER', label: '포인트 배수' },
    { value: 'BUNDLE', label: '번들' },
    { value: 'TIME_BASED', label: '시간 기반' },
    { value: 'MEMBERSHIP', label: '멤버십' },
  ] as const;

export const DISCOUNT_TYPE_OPTIONS: { value: DiscountType; label: string }[] = [
  { value: 'FIXED', label: '정액 할인 (₩)' },
  { value: 'PERCENTAGE', label: '정률 할인 (%)' },
  { value: 'FREE_ITEM', label: '무료 상품' },
  { value: 'UPGRADE', label: '업그레이드' },
] as const;

export const PROMOTION_TARGET_OPTIONS: {
  value: PromotionTarget;
  label: string;
}[] = [
  { value: 'ALL', label: '전체 고객' },
  { value: 'NEW_CUSTOMERS', label: '신규 고객' },
  { value: 'EXISTING_CUSTOMERS', label: '기존 고객' },
  { value: 'VIP', label: 'VIP 고객' },
  { value: 'SPECIFIC_SEGMENT', label: '특정 세그먼트' },
] as const;

export const PROMOTION_STATUS_FILTER_OPTIONS = PROMOTION_STATUS_OPTIONS.filter(
  (o) => o.value !== 'ALL'
) as { value: PromotionStatus; label: string; variant: string }[];

export const PROMOTION_TABLE_STATUS_OPTIONS = PROMOTION_STATUS_OPTIONS.filter(
  (o) => o.value !== 'ALL'
).map(({ value, label }) => ({ value, label }));

export const PROMOTION_TABLE_TYPE_OPTIONS = PROMOTION_TYPE_OPTIONS.map(
  ({ value, label }) => ({ value, label })
);
