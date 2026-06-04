export interface CartBreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showStats: boolean;
}

export const CART_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '장바구니 관리',
    title: '장바구니 관리',
    showInBreadcrumb: true,
    showStats: true,
  },
  CREATE: {
    label: '장바구니 추가',
    title: '장바구니 상품 추가',
    showInBreadcrumb: true,
    showStats: false,
  },
} as const;

export const DEFAULT_CART_BREADCRUMB_CONFIG: CartBreadcrumbConfig = {
  label: '장바구니',
  title: '장바구니',
  showInBreadcrumb: true,
  showStats: false,
};
