export const LOYALTY_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '회원 등급 관리',
    title: '회원 등급 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: true,
  },
  SETTINGS: {
    label: '멤버십 설정',
    title: '멤버십 설정',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  STAR_EVENTS: {
    label: '별 적립 이벤트',
    title: '별 적립 이벤트 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  STAR_HISTORY: {
    label: '별 히스토리',
    title: '별 적립/사용 히스토리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const DEFAULT_LOYALTY_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '회원 등급',
  title: '회원 등급 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
