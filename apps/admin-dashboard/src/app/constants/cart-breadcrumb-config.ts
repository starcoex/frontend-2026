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
} as const;

export const DEFAULT_CART_BREADCRUMB_CONFIG: CartBreadcrumbConfig = {
  label: '장바구니',
  title: '장바구니',
  showInBreadcrumb: true,
  showStats: false,
};
