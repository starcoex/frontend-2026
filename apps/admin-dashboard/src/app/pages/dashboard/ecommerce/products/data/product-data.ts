export const PRODUCT_STATUS_OPTIONS = [
  { value: 'active', label: '판매 중' },
  { value: 'out-of-stock', label: '품절' },
  { value: 'closed-for-sale', label: '판매 중단' },
] as const;

export type ProductStatusValue =
  (typeof PRODUCT_STATUS_OPTIONS)[number]['value'];

export const PRODUCT_FEATURED_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'featured', label: '추천 상품' },
  { value: 'normal', label: '일반 상품' },
] as const;

export const PRODUCT_STOCK_FILTER_OPTIONS = [
  { value: 'all', label: '전체 재고' },
  { value: 'in-stock', label: '재고 있음' },
  { value: 'low-stock', label: '재고 부족 (10개 미만)' },
  { value: 'out-of-stock', label: '재고 없음' },
] as const;

export type ProductStockFilterValue =
  (typeof PRODUCT_STOCK_FILTER_OPTIONS)[number]['value'];

export const PRODUCT_SORT_OPTIONS = [
  { value: 'createdAt_desc', label: '최신순' },
  { value: 'createdAt_asc', label: '오래된순' },
  { value: 'basePrice_asc', label: '가격 낮은순' },
  { value: 'basePrice_desc', label: '가격 높은순' },
  { value: 'name_asc', label: '이름 오름차순' },
  { value: 'name_desc', label: '이름 내림차순' },
  { value: 'rating_desc', label: '평점 높은순' },
  { value: 'orderCount_desc', label: '주문 많은순' },
] as const;

export type ProductSortValue = (typeof PRODUCT_SORT_OPTIONS)[number]['value'];

// 재고 부족 기준
export const LOW_STOCK_THRESHOLD = 10;
