export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const ORDER_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '주문 관리',
    title: '주문 관리',
    showInBreadcrumb: true,
    showActions: true, // ✅ true로 변경 → 주문 추가 버튼 표시
    showTabs: true, // ✅ true → OrderStats 표시
  },
  CREATE: {
    label: '주문 추가',
    title: '주문 추가',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_ORDER_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '주문 관리',
  title: '주문 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
