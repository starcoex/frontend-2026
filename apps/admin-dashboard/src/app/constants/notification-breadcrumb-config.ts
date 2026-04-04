export interface BreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb: boolean;
  showActions: boolean;
  showStats: boolean;
}

export const NOTIFICATION_BREADCRUMB_CONFIGS = {
  LIST: {
    label: '알림 목록',
    title: '알림 관리',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  SEND: {
    label: '알림 전송',
    title: '알림 전송',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  EMAILS: {
    label: '이메일 목록',
    title: '이메일 관리',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  STATS: {
    label: '알림 통계',
    title: '알림 통계',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
} as const;

export const DEFAULT_NOTIFICATION_BREADCRUMB_CONFIG: BreadcrumbConfig = {
  label: '알림',
  title: '알림 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
