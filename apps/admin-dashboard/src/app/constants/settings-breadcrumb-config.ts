export interface BreadcrumbConfig {
  label: string;
  title: string;
  description?: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const SETTINGS_BREADCRUMB_CONFIGS = {
  ROOT: {
    label: '일반 설정',
    title: '일반 설정',
    description: '기본 애플리케이션 설정 및 환경 설정을 구성합니다.',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  BILLING: {
    label: '결제 설정',
    title: '결제 및 구독',
    description: '구독, 결제 수단, 결제 내역을 관리합니다.',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  NOTIFICATIONS: {
    label: '알림 설정',
    title: '알림 설정',
    description: '알림을 수신하는 방법과 시기를 구성합니다.',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
} as const;

export const DEFAULT_SETTINGS_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '설정',
  title: '설정',
  description: '애플리케이션 설정을 관리합니다.',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
