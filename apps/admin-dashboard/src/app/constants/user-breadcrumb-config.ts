export interface UserBreadcrumbConfig {
  label: string;
  title: string;
  showInBreadcrumb?: boolean;
  showActions?: boolean;
  showStats?: boolean;
}

export const BREADCRUMB_CONFIGS: Record<string, UserBreadcrumbConfig> = {
  LIST: {
    label: '사용자',
    title: '사용자 목록',
    showInBreadcrumb: true,
    showActions: true,
    showStats: true,
  },
  CREATE: {
    label: '사용자 생성',
    title: '새 사용자 생성',
    showInBreadcrumb: true,
    showActions: false,
    showStats: false,
  },
  ADMINS: {
    label: '관리자',
    title: '관리자 목록',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  MEMBERS: {
    label: '일반 회원',
    title: '일반 회원 목록',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  DRIVERS: {
    label: '배송 담당자',
    title: '배송 담당자 목록',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
  INVITATIONS: {
    label: '초대 관리',
    title: '사용자 초대 목록',
    showInBreadcrumb: true,
    showActions: true,
    showStats: false,
  },
} as const;

export const DEFAULT_BREADCRUMB_CONFIG: UserBreadcrumbConfig = {
  label: '사용자',
  title: '사용자 관리',
  showInBreadcrumb: true,
  showActions: false,
  showStats: false,
};
