export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showTabs: boolean;
}

export const CONTACT_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '문의 관리',
    title: '문의 관리',
    showInBreadcrumb: true,
    showActions: true, // ★ false → true (통계 버튼 표시)
    showTabs: true,
  },
  STATS: {
    label: '문의 통계',
    title: '문의 통계',
    showInBreadcrumb: true,
    showActions: false,
    showTabs: false,
  },
} satisfies Record<string, BreadcrumbConfig>;

export const DEFAULT_CONTACT_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '문의 관리',
  title: '문의 관리',
  showInBreadcrumb: true,
  showActions: false,
  showTabs: false,
};
