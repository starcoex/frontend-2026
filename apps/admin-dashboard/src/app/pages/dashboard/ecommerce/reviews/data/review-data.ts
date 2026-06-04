import type {
  ReviewStatus,
  ReviewType,
  ReviewTargetType,
} from '@starcoex-frontend/reviews';

export const REVIEW_STATUS_OPTIONS: { value: ReviewStatus; label: string }[] = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'HIDDEN', label: '숨김' },
  { value: 'DELETED', label: '삭제됨' },
  { value: 'REPORTED', label: '신고됨' },
];

export const REVIEW_TYPE_OPTIONS: { value: ReviewType; label: string }[] = [
  { value: 'PRODUCT', label: '상품 리뷰' },
  { value: 'SERVICE', label: '서비스 리뷰' },
  { value: 'DELIVERY', label: '배달 리뷰' },
  { value: 'GENERAL', label: '일반 리뷰' },
];

export const REVIEW_TARGET_TYPE_OPTIONS: {
  value: ReviewTargetType;
  label: string;
}[] = [
  { value: 'PRODUCT', label: '상품' },
  { value: 'STORE', label: '매장' },
  { value: 'ORDER', label: '주문' },
  { value: 'DELIVERY', label: '배달' },
  { value: 'RESERVATION', label: '예약' },
  { value: 'GENERAL', label: '일반' },
];

export const REVIEW_STATUS_CONFIG: Record<
  ReviewStatus,
  {
    label: string;
    variant: 'success' | 'warning' | 'destructive' | 'secondary';
  }
> = {
  ACTIVE: { label: '활성', variant: 'success' },
  HIDDEN: { label: '숨김', variant: 'warning' },
  DELETED: { label: '삭제됨', variant: 'destructive' },
  REPORTED: { label: '신고됨', variant: 'secondary' },
};

export const REVIEW_TYPE_CONFIG: Record<ReviewType, { label: string }> = {
  PRODUCT: { label: '상품' },
  SERVICE: { label: '서비스' },
  DELIVERY: { label: '배달' },
  GENERAL: { label: '일반' },
};

export const REVIEW_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'rating_desc', label: '평점 높은순' },
  { value: 'rating_asc', label: '평점 낮은순' },
] as const;

export const MIN_RATING = 1;
export const MAX_RATING = 5;
